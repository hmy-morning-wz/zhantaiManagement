import React, {Component} from 'react';
import {Breadcrumb} from 'antd'
import createhistory from 'history/createHashHistory';
import {Form, Input, Tooltip, Icon, Select, Button} from 'antd';
import notice from "../../../CommonComponent/Notification/Notification"
import axios from "../../../Axios/index"

const history = createhistory();
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class RegistrationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            areas: [],
            systemList: []
        };
        this.handleSubmit = (e) => {
            e.preventDefault();
            let _this = this;
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    if (_this.state.stageId) {
                        values.id = _this.state.stageId;
                    }
                    let areas = _this.state.areas;
                    for (let i = 0; i < areas.length; i++) {
                        let obj = areas[i];
                        if ((obj.id + "") === (values.stageArea + ""))
                            values.stageAreaName = obj.name
                    }
                    axios.post('/addStageOrUpdate', values)
                        .then(function (response) {
                            response = response.data;
                            if (response.errorCode === "0") {
                                notice("success", '操作成功', "展台" + (_this.state.stageId ? "修改" : "添加") + "成功");
                                history.push({pathname: '/parentStage'})
                            } else {
                                notice("error", '操作失败', response.value)
                            }
                        })
                        .catch(function (err) {
                        });
                }
            });
        }
    }

    componentDidMount() {
        this.getSelect();
        if (sessionStorage.record !== undefined) {
            let record = JSON.parse(sessionStorage.getItem("record"));
            this.setState({stageId: record.id})
            let stagePosition = record.stagePosition;
            this.props.form.setFieldsValue({
                stagePlatform: record.stagePlatform ? record.stagePlatform : undefined,
                stageName: record.stageName,
                remark: record.remark,
                stageArea: record.stageArea + "",
                stageId: record.id,
                status: record.status + "",
                stagePosition: stagePosition + "",
                version: record.version,
            })
        }
    }

    getSelect() {
        let _this = this
        axios.get('/area/getAreaListAll', {}).then((response) => {
            response = response.data
            if (response.errorCode === "0") {

                _this.setState({
                    areas: response.areas
                });
            } else {
                notice("error", '获取区域列表失败', response.value)
            }
        }).catch(function (err) {
        });
    }

    componentWillUnmount() {
        if (sessionStorage.record !== undefined) {
            sessionStorage.removeItem("record");
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({pathname: '/'})}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a
                        onClick={() => history.push({pathname: '/parentStage'})}>父展台管理列表</a></Breadcrumb.Item>
                    <Breadcrumb.Item>父展台详情{this.state.stageId ? "修改" : "添加"}</Breadcrumb.Item>
                </Breadcrumb>
                <br/><br/><br/>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                            展台名&nbsp;
                        <Tooltip title="显示于展台上方">
                            <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>)}
                >
                    {getFieldDecorator('stageName', {
                        rules: [{
                            required: true, message: '请输入展台名',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="展台位置"
                >
                    {getFieldDecorator('stagePosition', {
                        rules: [{
                            required: true, message: '请输入展台位置!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="展台区域"
                >
                    {getFieldDecorator('stageArea', {
                        rules: [{
                            required: true, message: '请选择展台区域!',
                        }],
                    })(
                        <Select defaultValue="lucy" style={{width: "100%"}}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                onChange={() => {
                                }}>
                            {this.state.areas.map((v, i) => {
                                return (<Option value={v.id + ""}>{v.cityName}</Option>)
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="展台平台"
                >
                    {getFieldDecorator('stagePlatform', {
                        rules: [{
                            required: true, message: '请选择展台平台!',
                        }],
                    })(
                        <Select  style={{ width: "100%" }}
                                 getPopupContainer={triggerNode => triggerNode.parentNode}
                                 onChange={()=>{}}>
                            <Option value="1">通用</Option>
                            <Option value="2">iOS</Option>
                            <Option value="3">Android</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="展台状态"
                >
                    {getFieldDecorator('status', {
                        rules: [{
                            required: true, message: '请选择展台状态!',
                        }],
                    })(
                        <Select style={{width: "100%"}} onChange={() => {
                        }}>
                            <Option value="1">停用</Option>
                            <Option value="0">启用</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                            App版本&nbsp;
                        <Tooltip title="例：1.0.0,适用App版本">
                            <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>)}
                >
                    {getFieldDecorator('version', {
                        rules: [{
                            required: true, message: '请输入App版本',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                            展台描述&nbsp;
                        <Tooltip title="记录展台详细信息">
                            <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>)}
                >
                    {getFieldDecorator('remark', {
                        rules: [{
                            required: true, message: '请输入展台描述',
                        }],
                    })(
                        <TextArea/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                    <Button type="primary" htmlType="submit" style={{width: '150px'}}>确定</Button>
                    <Button style={{marginLeft: '20px', width: '150px'}}
                            onClick={() => history.push({pathname: '/parentStage'})}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}

const ParentStageChange = Form.create()(RegistrationForm);

export default ParentStageChange;