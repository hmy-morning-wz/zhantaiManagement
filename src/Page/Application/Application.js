import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Table, Divider, Row, Col, Button, Input, Breadcrumb, Modal,Select} from 'antd';
import notice from "../../CommonComponent/Notification/Notification"
import axios from "../../Axios/index"
const Option=Select.Option;
const Search = Input.Search;
const history = createhistory();

class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platformName: '展台名',
            applicationName: "",
            loading: false,
            visible: false,
            appId: '',
            total: 0,
            pageNum: 1,
            systemList:[],
            columns: [
                {
                    title: 'appId',
                    dataIndex: 'appId',
                    key: 'appId',
                }, {
                    title: '应用名',
                    dataIndex: 'applicationName',
                    key: 'applicationName',
                }, {
                    title: '应用描述',
                    dataIndex: 'remark',
                    key: 'remark',
                }, {
                    title: '应用类别',
                    dataIndex: 'appType',
                    key: 'appType',
                }, {
                    title: '跳转地址',
                    dataIndex: 'jumpUrl',
                    key: 'jumpUrl',
                }, {
                    title: '应用版本',
                    dataIndex: 'version',
                    key: 'version',
                }, {
                    title: '创建者',
                    dataIndex: 'createName',
                    key: 'createName',
                }, {
                    title: '状态',
                    dataIndex: 'appStatus',
                    key: 'appStatus',
                    render: (record) => (<div>{(record + "") === "0" ? "启用" : "禁用"}</div>),
                }, {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            {!sessionStorage.role.includes("ROLE_ADMIN")?<span><a onClick={() => {
                                sessionStorage.setItem("record", JSON.stringify(record));
                                history.push({pathname: "/applicationChange:" + record.appId,})
                            }}>修改</a>
                            <Divider type="vertical"/>
                            <a onClick={this.showModal.bind(this, record.id)}>删除</a>
                            <Divider type="vertical"/></span>:""}
                            <a onClick={() => {
                                let _this = this;
                               // const page = _this.state.paginationOption.current;
                                axios.get('/applicationStatus', {params:{
                                        applicationId: record.id,
                                        status: (record.appStatus + "") === "0" ? "1" : "0"
                                    }})
                                    .then(function (response) {
                                        response = response.data
                                        if (response.errorCode === "0") {
                                            notice("success", '操作成功', ((record.appStatus + "") === "1" ? "启用" : "禁用") + "成功")
                                            _this.getTable();
                                        } else {
                                            notice("error", '操作失败', response.value)
                                        }
                                    })
                                    .catch(function (err) {

                                    });
                            }}>{(record.appStatus + "") === "1" ? "启用" : "禁用"}</a>
                        </span>
                    ),
                }]
        }
        this.getTable = () => {
            let applicationName = this.state.applicationName;
            let _this = this;
            axios.post('/getApplicationList', {applicationName: applicationName,page: _this.state.pageNum, size: 10,developerId:_this.state.systemName})
                .then(function (res) {
                    _this.setState({
                        data: res.data.applicationList || [],
                        total: res.data.totalResult
                    })
                })
        }
        this.getDeveloperList = () => {
            let _this = this;
            axios.get('/getDeveloperList')
                .then(function (res) {
                    res = res.data
                    if (res.errorCode !== "0") return notice("error", "获取应用开发商失败", res.value)
                    let arr = []
                    for (const prop in res.data) {
                        arr.push({key: prop, value: res.data[prop] ? res.data[prop] : prop})
                    }
                    console.log(arr)
                    _this.setState({
                        systemList: arr
                    })
                })
        }
    }

    componentWillMount() {
        this.getTable();
        this.getDeveloperList();
    }

    showModal(id) {
        this.setState({
            visible: true,
            appId: id
        });
    }

    handleOk() {
        this.setState({loading: true});
        let _this = this;
        const id = _this.state.appId;
        axios.get('/delApp', {params: {id: id}})
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    notice("success", '操作成功', "删除成功")
                    _this.getTable();
                    _this.setState({loading: false, visible: false});
                } else {
                    _this.setState({loading: false});
                    notice("error", '操作失败', response.value)
                }
            })
            .catch(function (err) {
            });
    }

    handleCancel() {
        this.setState({visible: false});
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({pathname: '/'})}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item>应用管理列表</Breadcrumb.Item>
                </Breadcrumb>

                <Row type="flex" justify="space-around" style={{margin: '15px 0'}}>
                    <Col span={12}>
                        <Search
                            placeholder="请输入应用名"
                            onSearch={value => {
                                this.setState({applicationName: value}, this.getTable)
                            }}
                            enterButton="搜索"
                            style={{width: 300}}
                        />
                    </Col>
                    <Col span={6}>
                        {sessionStorage.role.includes("ROLE_ADMIN")?<Select
                            value={this.state.systemName}
                            style={{width: "100%"}}
                            placeholder={"请选择系统开发商"}
                            onSelect={(e)=>{
                                this.setState({systemName:e},this.getTable)
                            }}
                        >
                            {this.state.systemList.map((v,i)=>{
                                return  <Option value={v.key}>
                                    {v.value}
                                </Option>
                            })}
                        </Select>:""}
                    </Col>
                    <Col span={4} offset={2}>
                        {!sessionStorage.role.includes("ROLE_ADMIN")?<Button type="primary" style={{width: '100%'}}
                                onClick={() => {
                                    sessionStorage.removeItem("record");
                                    history.push({pathname: "/applicationChange:"})
                                }}>添加应用</Button>:""}
                    </Col>
                </Row>

                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    rowKey={record => record.appId}
                    pagination={
                        {
                            current: this.state.pageNum,
                            pageSize: 10,
                            total: this.state.total,
                            onChange: (v) => {
                                console.log(v)
                                this.setState({pageNum: v}, this.getTable)
                            }
                        }
                    }/>
                <Modal
                    visible={this.state.visible}
                    title="删除应用"
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel.bind(this)}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading}
                                onClick={this.handleOk.bind(this)}>确定</Button>,
                    ]}
                >
                    <p style={{textAlign: 'center', fontSize: '16px'}}>确定删除该应用吗？</p>
                </Modal>
            </div>

        );
    }
}

export default Application;