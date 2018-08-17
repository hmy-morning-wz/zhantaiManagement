import React, { Component } from 'react';
import createhistory from 'history/createHashHistory';
import { Table, Select, Divider, Row, Col, Button, Input, Breadcrumb ,Modal} from 'antd';
import axios from "../../Axios/index"
import notice from "../../CommonComponent/Notification/Notification"
import moment from 'moment';
const Option=Select.Option;
const Search = Input.Search;
const history = createhistory();
const confirm=Modal.confirm;
class Version extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationName: '',
            loading: false,
            tableLength: 0,
            total:0,
            pageNum:1,
            data: [],
            columns: [
                {
                    title: '版本号',
                    dataIndex: 'versionName',
                    key: 'versionName',
                    fixed: 'left',
                    width: 120
                }, {
                    title: '识别版本号',
                    dataIndex: 'versionCode',
                    key: 'versionCode',
                }, {
                    title: '更新内容',
                    dataIndex: 'releaseNotes',
                    key: 'releaseNotes',
                }, {
                    title: '客户端',
                    dataIndex: 'platform',
                    key: 'platform',
                }, {
                    title: '下载链接',
                    dataIndex: 'updateUrl',
                    key: 'updateUrl'
                }, {
                    title: '是否强制升级',
                    dataIndex: 'isUpdate',
                    key: 'isUpdate',
                    render: (record) => (<div>{record === "1" ? "是" : "否"}</div>),
                }, {
                    title: '支持最低版本',
                    dataIndex: 'minVersionCode',
                    key: 'minVersionCode'
                }, {
                    title: '更新时间',
                    dataIndex: 'releaseTime',
                    key: 'releaseTime',
                    render: (i, record) => i ? moment(i).format("YYYY-MM-DD") : null
                }, {
                    title: '更新人',
                    dataIndex: 'modifiedPerson',
                    key: 'modifiedPerson'
                }, {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 150,
                    render: (text, record) => (
                        <span>
                            <a onClick={() => {
                                sessionStorage.setItem("record", JSON.stringify(record));
                                history.push({ pathname: "/versionAdd:" + record.appVersionId, })
                            }}>修改</a>
                            <Divider type="vertical" />
                            <a onClick={() => {
                                let _this = this;
                                confirm({
                                    title: '确认要删除该版本吗?',
                                    content: '删除后无法恢复',
                                    okText: '确认',
                                    okType: 'danger',
                                    cancelText: '取消',
                                    onOk() {
                                        let appVersionId = record.appVersionId;
                                        axios.get(`/deleteAppVersion/${appVersionId}`)
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
                        </span>
                    ),
                }]
        }
    }

    componentWillMount() {
        this.getTable();
    }

    getTable() {
        /* 获取版本列表数据 */
        let versionName = this.state.versionName;
        let _this = this;
        axios.get('/getAppVersionList',{params:{pageNum:_this.state.pageNum,pageSize:'10',versionName:versionName?versionName:"",platform:_this.state.platform?_this.state.platform:""}})
        .then((response) => {
            response = response.data;
            if (response.errorCode === "0") {
               /* let userName = JSON.parse(sessionStorage.getItem("user")).userName;*/
                let length = response.data.length;
                for (let i = 0; i < length; i++) {
                    response.data[i].userName = "";
                }
                _this.setState({
                    loading: false,
                    tableLength: response.data.length,
                    data: response.data,
                    total:response.data.totalResult
                });

            } else {
                notice("error", '获取版本列表失败', response.value);
                _this.setState({
                    loading: false,
                });
            }
        }).catch(function (err) {
        });
    }

    addVersion() {
        history.push({ pathname: "/versionAdd:" })
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({ pathname: '/' })}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item>版本升级管理</Breadcrumb.Item>
                </Breadcrumb>
                <Row type="flex" justify="space-around" style={{ margin: '15px 0' }}>
                    <Col span={6}>
                        平台:&nbsp;
                        <Select style={{width: "75%"}}
                                placeholder={"请选择平台"}
                                value={this.state.platform}
                                allowClear={true}
                                onChange={(e) => this.setState({platform:e})}>
                            <Option value={"android"}>android</Option>
                            <Option value={"iphone"}>iphone</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        &nbsp;
                        <Search
                            placeholder="请输入版本名"
                            onSearch={value => {
                                this.setState({versionName:value,pageNum:1},this.getTable)
                            }}
                            enterButton="搜索"
                            style={{width: "80%"}}
                        />
                    </Col>
                    <Col span={4} offset={6}>
                        <Button type="primary" style={{ width: '100%' }}
                            onClick={this.addVersion.bind(this)}>新增</Button>
                    </Col>
                </Row>
                <Table bordered
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    scroll={{ x: 1500, }}
                    rowKey={record => record.appVersionId}
                    loading={this.state.loading}
                    pagination={
                        {
                            current:this.state.pageNum,
                            pageSize:10,
                            total:this.state.total,
                            onChange:(v)=>{
                                console.log(v)
                                this.setState({pageNum:v}, this.getTable)
                            }
                        }
                    }
                />
            </div>

        );
    }
}

export default Version;
