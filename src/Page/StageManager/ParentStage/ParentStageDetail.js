import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Table, Row, Col, Button, Input, Breadcrumb, Modal, Select, Divider} from 'antd';
import axios from "../../../Axios/index"
import notice from "../../../CommonComponent/Notification/Notification"



const Search = Input.Search;
const history = createhistory();
const Option = Select.Option;

class ShowPlatformDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: undefined,
            platformName: '展台名',
            visibleAddApp: false,
            confirmLoadingAddApp: false,
            visibleAddStage: false,
            confirmLoadingAddStage: false,
            stageConfigType: '0',
            pageNum: 1,
            columns:  [
                {
                    title: '子展台名',
                    dataIndex: 'childStageName',
                    key: 'childStageName',
                }, {
                    title: '展台状态',
                    key: 'status',
                    dataIndex: 'status',
                    render: (record) => (<div>{record === 0 ? '启用' : "禁用"}</div>)
                }, {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                },{
                    title: '排序',
                    dataIndex: 'softing',
                    key: 'softing',
                }, {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <a onClick={() => {
                                this.setState({sortNum:record.softing,addStageId:record.id,configStageId:record.configStageId})
                                this.showModalAddStage()
                            }}>修改</a>
                            <Divider type="vertical"/>
                            <a onClick={() => {
                                let _this = this
                                axios.get('/delConfigStage', {params:{
                                    id:record.configStageId
                                }})
                                    .then(function (response) {
                                        response = response.data
                                        if (response.errorCode === "0") {
                                            notice("success", '操作成功', "删除成功")
                                            _this.getStageTable();
                                        } else {
                                            notice("error", '操作失败', response.value)
                                        }

                                    })
                                    .catch(function (err) {

                                    });
                            }}>删除</a>
                        </span>
                    ),
                }],
            total: 0,
            addStageId: '',
            addAppId: '',
            addAppOption: [],
            addStageOption: []
        }
    }

    showModalAddStage() {
        this.setState({
            visibleAddStage: true,
        });
    }

    handleOkAddStage() {
	    let _this = this;
	    if(!_this.state.sortNum||!(typeof _this.state.sortNum===typeof 1||parseInt(_this.state.sortNum,10))){
		    return notice("error", '失败', "请输入正确的排序")
	    }
	    if(!_this.state.addStageId){
		    return notice("error", '失败', "请选择正确配置的展台")
	    }
	    this.setState({
		    confirmLoadingAddStage: true,
	    });
        axios.get('/configStage', {
            params: {
                id: _this.state.configStageId,
                stageId: _this.state.stageId,
                childStageId: _this.state.addStageId,
                softing: _this.state.sortNum
            }
        })
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    notice("success", '操作成功', "展台配置成功");
                    _this.setState({
                        visibleAddStage: false,
                        confirmLoadingAddStage: false,
                    });
                    _this.getStageTable();
                } else {
	                _this.setState({
		                confirmLoadingAddStage: false,
	                });
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {
	            _this.setState({
		            confirmLoadingAddStage: false,
	            });
	            notice("error", '失败', "服务器失去响应")
            });

    }

    handleCancelAddStage() {
        notice("info", '取消操作', "取消添加展台")
        this.setState({
            visibleAddStage: false,
            confirmLoadingAddStage: false,
        });
    }

    handleChangeAddStage(value) {
        this.setState({addStageId:value})
        console.log(`selected ${value}`);
    }

    componentDidMount() {
        if (sessionStorage.record !== undefined) {
            let record = JSON.parse(sessionStorage.getItem("record"));
            this.getChildrenStage();
            this.setState({stageId:record.id,platformName: record.stageName, stageConfigType: record.stageConfigType},this.getStageTable)
        }

    }

    getStageTable() {
        let _this = this;
        axios.get('/configStageList', {
            params: {
                stageId: _this.state.stageId,
	            childStageName: _this.state.stageName,
                status: '',
                pageNum: _this.state.pageNum,
                pageSize: '10'
            }
        })
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    //notice("success",'操作成功',"展台"+(_this.state.stageId?"修改":"添加")+"成功");
                    _this.setState({data: response.childStageList, total: response.totalResult})
                } else {
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {

            });
    }

    getChildrenStage() {
        let _this = this;
        axios.get('/getChildStageList', {params: {pageNum: 1, pageSize: 1e6}})
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    //notice("success",'操作成功',"展台"+(_this.state.stageId?"修改":"添加")+"成功");
                    _this.setState({addStageOption: response.childStageList})
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
        const {visibleAddStage, confirmLoadingAddStage} = this.state;
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({pathname: '/'})}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a
                        onClick={() => history.push({pathname: '/parentStage'})}>展台管理列表</a></Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.platformName}</Breadcrumb.Item>
                </Breadcrumb>
                <Row type="flex" justify="space-around" style={{margin: '15px 0'}}>
                    <Col span={12}>
                        <Search
                            placeholder="请输入展台名"
                            enterButton="搜索" size="default"
                            onSearch={value => {
                                this.setState({stageName:value}, this.getStageTable)
                            }}
                            style={{width: 300}}
                        />
                    </Col>
                    <Col span={4} offset={8}>
                        <Button type="primary" style={{width: '100%'}}
                                onClick={
                                    ()=>{
                                        this.setState({sortNum:undefined,addStageId:undefined,configStageId:undefined},()=>{this.showModalAddStage()})
                                    }}>添加展台</Button>
                    </Col>
                </Row>
                <Modal title="添加展台"
                       visible={visibleAddStage}
                       onOk={this.handleOkAddStage.bind(this)}
                       confirmLoading={confirmLoadingAddStage}
                       onCancel={this.handleCancelAddStage.bind(this)}
                >
                    <Row>
                        <Col span={8}>
                            请选择添加的展台
                        </Col>
                        <Col span={16}>
                            <Select value={this.state.addStageId}
                                    showSearch
                                    optionFilterProp="children"
                                    style={{width: "100%"}} onChange={this.handleChangeAddStage.bind(this)}>
                                {this.state.addStageOption.map((v, i) =>
                                    <Option value={v.id}>{v.childStageName + " " + v.remark}</Option>
                                )}
                            </Select>
                        </Col>
                        <br/><br/>
                        <Col span={8}>
                            排序
                        </Col>
                        <Col span={16}>
                            <Input value={this.state.sortNum} onChange={(e) => {
                                this.setState({sortNum: e.target.value})
                            }}/>
                        </Col>
                    </Row>
                </Modal>
                <Table columns={this.state.columns} dataSource={this.state.data}
                       pagination={
                           {
                               current: this.state.pageNum,
                               pageSize: 10,
                               total: this.state.total,
                               onChange: (v) => {
                                   console.log(v)
                                   this.setState({pageNum: v})
                                   this.getStageTable();
                               }
                           }
                       }/>
            </div>

        );
    }
}

export default ShowPlatformDetail;

