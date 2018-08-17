import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Table, Divider, Row, Col, Button, Input, Breadcrumb, Modal, Select} from 'antd';
import axios from "../../../Axios/index"
import notice from "../../../CommonComponent/Notification/Notification"

const Search = Input.Search;
const history = createhistory();
const confirm = Modal.confirm;
const Option = Select.Option;

class ParentStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stageName: '',
            data: [],
            total: 0,
            pageNum: 1,
            systemList: [],
            columns: [
                {
                    title: '父展台名',
                    dataIndex: 'stageName',
                    key: 'stageName',
                    fixed: 'left',
                    width: 120
                }, {
                    title: '展台状态',
                    key: 'status',
                    dataIndex: 'status',
                    width: 140,
                    render: (record) => (<div>{(record + "" === "0") ? '启用' : "禁用"}</div>)
                }, {
                    title: '展台位置',
                    dataIndex: 'stagePosition',
                    key: 'stagePosition',
                    width: 120,
                }, {
                    title: '展台平台',
                    dataIndex: 'stagePlatform',
                    key: 'stagePlatform',
                    width: 120,
                    render: (record) => {switch(record+""){
                        case "1": return "通用";
                        case "2": return "iOS";
                        case "3": return "Android";
                        default : return "未知"
                    }
                    }
                }, {
                    title: '展台区域',
                    dataIndex: 'stageAreaName',
                    key: 'stageAreaName',
                    width: 160,
                }, {
                    title: 'app版本',
                    dataIndex: 'version',
                    key: 'version',
                    width: 120,
                }, {
                    title: '创建人',
                    dataIndex: 'createName',
                    key: 'createName',
                    width: 100,
                }, {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                    width: 240,
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: (record) => (<span>{new Date(record).toLocaleString()}</span>),
                    width: 175,
                }, {
                    title: '修改时间',
                    dataIndex: 'modifyTime',
                    key: 'modifyTime',
                    render: (record) => (<span>{new Date(record).toLocaleString()}</span>),
                    width: 175,
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 200,
                    render: (text, record) => (
                        <span>
                            <a onClick={() => {
                                let _this = this;
                                console.log(record.status)
                                axios.get('/stageStatus', {
                                    params: {
                                        stageId: record.id,
                                        status: record.status === 0 ? "1" : "0"
                                    }
                                })
                                    .then(function (response) {
                                        response = response.data
                                        if (response.errorCode === "0") {
                                            notice("success", '操作成功', (record.status === 1 ? "启用" : "禁用") + "成功")
                                            _this.getTable();
                                        } else {
                                            notice("error", '操作失败', response.value)
                                        }
                                    })
                                    .catch(function (err) {

                                    });
                            }}>{record.status === 1 ? "启用" : "禁用"}</a>

                            {!sessionStorage.role.includes("ROLE_ADMIN") ?
                                <span><Divider type="vertical"/><a onClick={() => {
                                    sessionStorage.setItem("record", JSON.stringify(record));
                                    history.push({pathname: "/parentStageChange:" + record.id,})
                                }}>修改</a>
                          <Divider type="vertical"/>
                          <a onClick={() => {
                              let _this = this;
                              confirm({
                                  title: '确认要删除父展台吗?',
                                  content: '删除后无法恢复',
                                  okText: '确认',
                                  okType: 'danger',
                                  cancelText: '取消',
                                  onOk() {
                                      axios.get('/del', {params: {stageId: record.id}})
                                          .then(function (response) {
                                              response = response.data;
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

                          }}>删除</a>
                          <Divider type="vertical"/>

                          <a onClick={() => {
                              sessionStorage.setItem("record", JSON.stringify(record));
                              history.push({pathname: "/parentStageDetail:" + record.stageId})
                          }}>配置</a></span> : ""}
                        </span>
                    ),
                }]
        }
        this.getTable = () => {
            let _this = this;
            axios.get('/getStageList', {
                params: {
                    stageName: _this.state.stageName,
                    status: '',
                    pageNum: _this.state.pageNum,
                    pageSize: '10',
                    systemId: _this.state.systemName
                }
            })
                .then(function (response) {
                    /*console.log(response.data)*/
                    for (let i = 0; i < response.data.stageList.length; i++) {
                        const argument = response.data.stageList[i];
                        argument.key = i;
                    }
                    _this.setState({data: response.data.stageList, total: response.data.totalResult})
                })
                .catch(function (err) {

                });
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
                    <Breadcrumb.Item>父展台管理列表</Breadcrumb.Item>
                </Breadcrumb>
                <Row type="flex" justify="space-around" style={{margin: '15px 0'}}>
                    <Col span={12}>
                        <Search
                            placeholder="请输入展台名"
                            onSearch={value => {
                                this.setState({stageName: value}, this.getTable)
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
                        {!sessionStorage.role.includes("ROLE_ADMIN") ? <Button type="primary" style={{width: '100%'}}
                                onClick={() => {
                                    sessionStorage.removeItem("record");
                                    history.push({pathname: "/parentStageChange:"})
                                }}>添加展台</Button>:""}
                    </Col>
                </Row>
                <Table bordered
                       columns={this.state.columns}
                       dataSource={this.state.data} scroll={{x: 1500,}}
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
            </div>

        );
    }
}

export default ParentStage;

