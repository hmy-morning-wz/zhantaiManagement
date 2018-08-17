import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Table, Divider, Row, Col, Button, Input, Breadcrumb, Modal, Select} from 'antd';
import axios from "../../../Axios/index"
import notice from "../../../CommonComponent/Notification/Notification"

const Option = Select.Option;
const Search = Input.Search;
const history = createhistory();
const confirm = Modal.confirm;

class ChildrenStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stageName: '',
            data: [],
            total: 0,
            pageNum: 1,
            columns: [
                {
                    title: '子展台名',
                    dataIndex: 'childStageName',
                    key: 'childStageName',

                }, {
                    title: '展台状态',
                    key: 'status',
                    dataIndex: 'status',
                    render: (record) => (<div>{(record + "" === "0") ? '启用' : "禁用"}</div>)
                }, {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: (record) => (<span>{new Date(record).toLocaleString()}</span>),
                }, {
                    title: '修改时间',
                    dataIndex: 'modifyTime',
                    key: 'modifyTime',
                    render: (record) => (<span>{new Date(record).toLocaleString()}</span>),
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            {!sessionStorage.role.includes("ROLE_ADMIN") ? <span> <a onClick={() => {
                                sessionStorage.setItem("record", JSON.stringify(record));
                                history.push({pathname: "/childrenStageChange:" + record.stageId,})
                            }}>修改</a>
                          <Divider type="vertical"/>
                          <a onClick={() => {
                              let _this = this
                              confirm({
                                  title: '确定要删除子展台?',
                                  content: '删除后将无法恢复',
                                  okText: '确定',
                                  okType: 'danger',
                                  cancelText: '取消',
                                  onOk() {

                                      axios.get('/delChildStage', {params: {childStageId: record.id}})
                                          .then(function (response) {
                                              response = response.data
                                              if (response.errorCode === "0") {
                                                  notice("success", '操作成功', "删除成功")
                                                  _this.getTable();
                                              } else {
                                                  notice("error", '操作失败', response.value)
                                              }

                                          })
                                          .catch(function (err) {

                                          });
                                  },
                                  onCancel() {
                                      console.log('Cancel');
                                  },
                              });
                              /* */
                          }}>删除</a>
                          <Divider type="vertical"/></span> : ""}
                            <a onClick={() => {
                                let _this = this;
                                console.log(record.status)
                                axios.get('/childStageStatus', {
                                    params: {
                                        childStageId: record.id,
                                        status: (record.status + "") === "0" ? "1" : "0"
                                    }
                                })
                                    .then(function (response) {
                                        response = response.data
                                        if (response.errorCode === "0") {
                                            notice("success", '操作成功', (record.status === "1" ? "启用" : "禁用") + "成功")
                                            _this.getTable();
                                        } else {
                                            notice("error", '操作失败', response.value)
                                        }
                                    })
                                    .catch(function (err) {

                                    });
                            }}>{(record.status + "") === "1" ? "启用" : "禁用"}</a>

                            {!sessionStorage.role.includes("ROLE_ADMIN") ?
                                <span><Divider type="vertical"/><a onClick={() => {
                                    sessionStorage.setItem("record", JSON.stringify(record));
                                    history.push({pathname: "/childrenStageDetail:" + record.stageId})
                                }}>配置</a></span> : ""}
                        </span>
                    ),
                }],
            systemList: []
        }
        this.getSystemList = () => {
            let _this = this;
            axios.get('/getSystemList')
                .then(function (res) {
                    res = res.data
                    if (res.errorCode !== "0") return notice("error", "获取系统失败", res.value)
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
        this.getTable = () => {
            let stageName = this.state.childStageName;
            let _this = this
            axios.get('/getChildStageList', {
                params: {
                    childStageName: stageName,
                    status: '',
                    pageNum: _this.state.pageNum,
                    pageSize: '10',
                    systemId: _this.state.systemName
                }
            })
                .then(function (response) {
                    console.log(response.data)
                    _this.setState({data: response.data.childStageList, total: response.data.totalResult})
                })
                .catch(function (err) {

                });
        }
    }

    componentWillMount() {
        this.getTable();
        this.getSystemList();
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({pathname: '/'})}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item>展台管理列表</Breadcrumb.Item>
                </Breadcrumb>
                <Row type="flex" justify="space-around" style={{margin: '15px 0'}}>
                    <Col span={12}>
                        <Search
                            placeholder="请输入展台名"
                            onSearch={value => {
                                this.setState({childStageName: value}, this.getTable)
                            }}
                            enterButton="搜索" size="default"
                            style={{width: 300}}
                        />
                    </Col>
                    <Col span={6}>
                        {sessionStorage.role.includes("ROLE_ADMIN") ? <Select
                            value={this.state.systemName}
                            style={{width: "100%"}}
                            placeholder={"请选择系统"}
                            onSelect={(e) => {
                                this.setState({systemName: e}, this.getTable)
                            }}
                        >
                            {this.state.systemList.map((v, i) => {
                                return <Option value={v.key}>
                                    {v.value}
                                </Option>
                            })}
                        </Select> : ""}
                    </Col>
                    <Col span={4} offset={2}>
                        <Button type="primary" style={{width: '100%'}}
                                onClick={() => {
                                    sessionStorage.removeItem("record");
                                    history.push({pathname: "/childrenStageChange:"})
                                }}>添加展台</Button>
                    </Col>
                </Row>
                <Table columns={this.state.columns} dataSource={this.state.data} pagination={
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
            </div>

        );
    }
}

export default ChildrenStage;

