import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Table, Icon, Divider, Row, Col, Button, Input, Breadcrumb, Modal, Select,Tooltip} from 'antd';
import axios from "../../../Axios/index"
import notice from "../../../CommonComponent/Notification/Notification"

const Search = Input.Search;
const history = createhistory();
const Option = Select.Option;
class ChildrenStageDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platformName: '展台名',
            visibleAddApp: false,
	        visibleAddTemplate:false,
            confirmLoadingAddApp: false,
            columns: [
                {
                    title: '应用名',
                    dataIndex: 'applicationName',
                    key: 'applicationName',
                }, {
                    title: '应用描述',
                    dataIndex: 'remark',
                    key: 'remark',
                }, {
                    title: '跳转地址',
                    dataIndex: 'jumpUrl',
                    key: 'jumpUrl',
                }, {
                    title: '排序',
                    dataIndex: 'softing',
                    key: 'softing',
                }, {
		            title: '类型',
		            dataIndex: 'type',
		            key: 'type',
                    render:(text)=><span>{text===0?"应用":"应用模版"}</span>
	            },{
                    title: '操作',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <a onClick={() => {
                                let _this = this;
                                axios.get('/delChildStageConfigApp', {params:{id:record.configChildStageId}})
                                    .then(function (response) {
                                        response = response.data;
                                        if (response.errorCode === "0") {
                                            notice("success", '操作成功', "删除成功")
                                            _this.getAppTable();
                                        } else {
                                            notice("error", '操作失败', response.value)
                                        }

                                    })
                                    .catch(function (err) {

                                    });
                            }}>删除</a>
                            <Divider  type="vertical"/>

                            <a onClick={()=>{
                                console.log(record.softing)
                                this.setState({
                                    id:record.configChildStageId,
                                    sortNum:record.softing,
                                    addAppId:record.id,
                                    type:record.type
                                },this.showModalAddApp)

                            }}>配置</a>
                        </span>
                    ),
                }],
            addStageId: '',
            addAppId: '',
            total:0,
            pageNum:1,
            addAppOption: [],
            addStageOption: [],
	        templateList:[]
        }
    }

    showModalAddApp() {
        this.setState({
            visibleAddApp: true,
        });
    }

    handleOkAddApp() {
      
        let _this = this;
	    if(!_this.state.sortNum||!(typeof _this.state.sortNum===typeof 1||parseInt(_this.state.sortNum,10))){
		    return notice("error", '失败', "请输入正确的排序")
	    }
	    if(!_this.state.addAppId){
		    return notice("error", '失败', "请选择正确配置的应用")
	    }
	    this.setState({
		    confirmLoadingAddApp: true,
	    });
        axios.get('/childStageConfigApp', {params:{childStageId: _this.state.stageId, appId: _this.state.addAppId,softing:_this.state.sortNum,id: _this.state.id,type:_this.state.type}})
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    notice("success", '操作成功', "应用配置成功");
                    _this.setState({
                        visibleAddApp: false,
                        visibleAddTemplate:false,
                        confirmLoadingAddApp: false,
                    });
                    _this.getAppTable();
                } else {
                    _this.setState({
                        confirmLoadingAddApp: false,
                    });
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {

            });

    }

    handleCancelAddApp() {
        console.log('Clicked cancel button');
        this.setState({
            confirmLoadingAddApp: false,
	        visibleAddTemplate:false,
            visibleAddApp: false,
        });
    }

    handleChangeAddApp(value) {
        console.log(`selected ${value}`);
        this.setState({addAppId:value})
    }

    componentDidMount() {
        if (sessionStorage.record !== undefined) {
            this.getChildApp();
            let record = JSON.parse(sessionStorage.getItem("record"));
            this.setState({platformName: record.stageName,stageId:record.id,stageConfigType: record.stageConfigType}, this.getAppTable);
        }

    }
    getAppTable() {
        let _this = this;
        axios.get('/childStageConfigAppList', {
            params: {
                childStageId: _this.state.stageId,
                applicationName: _this.state.stageName,
                status: '',
                pageNum: _this.state.pageNum,
                pageSize: '10'
            }
        })
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    for (let i = 0; i <response.applicationList.length; i++) {
                        response.applicationList[i].key=i
                    }
                    _this.setState({data: response.applicationList, total: response.totalResult})
                } else {
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {

            });
    }

    getChildApp() {
        let applicationName = this.state.applicationName;
        let _this = this;
        axios.get('/checkApplication')
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    //notice("success",'操作成功',"展台"+(_this.state.stageId?"修改":"添加")+"成功");
                    _this.setState({addAppOption: response.applicationList})
                } else {
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {

            });
    }

    componentWillUnmount() {
        if (sessionStorage.record !== undefined) {
            sessionStorage.removeItem("record");
        }
    }

    render() {
        const {visibleAddApp, sortNum,addAppId, confirmLoadingAddApp} = this.state;
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({pathname: '/'})}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a
                        onClick={() => history.push({pathname: '/childrenStage'})}>展台管理列表</a></Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.platformName}</Breadcrumb.Item>
                </Breadcrumb>
                <Row type="flex" justify="space-around" style={{margin: '15px 0'}}>
                    <Col span={16}>
                        <Search
                            placeholder="请输入应用名"
                            onSearch={value => {
                                console.log(value)
                                this.setState({
                                    stageName:value
                                });
                                this.getAppTable();
                            }}
                            enterButton="搜索" size="default"
                            style={{width: 300}}
                        />
                    </Col>
                    <Col span={4} offset={2}>
                        <Button type="primary" style={{width: '100%'}}
                                onClick={()=>{
                                    this.setState({
                                        id:undefined,
                                        addAppId:undefined,
                                        sortNum:undefined,
                                        visibleAddApp: true,
                                        type:0
                                    });
                                }}>添加应用</Button>
                    </Col>
                </Row>
                <Modal title="添加应用"
                       width={"80%"}
                       visible={visibleAddApp}
                       onOk={this.handleOkAddApp.bind(this)}
                       confirmLoading={confirmLoadingAddApp}
                       onCancel={this.handleCancelAddApp.bind(this)}
                >
                    <Row>
                        <Col span={8}>
                            请选择添加的应用 <Tooltip title="应用名 | 版本 | APP类型 | 备注"><Icon type="question-circle-o"/></Tooltip>
                        </Col>
                        <Col span={16}>
                            <Select style={{width: "100%"}} value={addAppId?addAppId+"":""}
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={this.handleChangeAddApp.bind(this)}>
                                {this.state.addAppOption.map((v, i) =>
                                    <Option value={v.id+""}>{v.applicationName + ' | ' + v.version+" | "+v.appType+" | "+v.remark}</Option>
                                )}
                            </Select>
                        </Col>
                        <br/><br/>
                        <Col span={8}>
                            排序
                        </Col>
                        <Col span={16}>
                            <Input value={sortNum} onChange={(e) => {
                                this.setState({sortNum: e.target.value})
                            }}/>
                        </Col>
                    </Row>

                </Modal>
                <Table columns={this.state.columns} dataSource={this.state.data} pagination={
                    {
                        current:this.state.pageNum,
                        pageSize:10,
                        total:this.state.total,
                        onChange:(v)=>{
                            console.log(v)
                            this.setState({pageNum:v})
                            this.getAppTable();
                        }
                    }
                }/>
            </div>

        );
    }
}

export default ChildrenStageDetail;

