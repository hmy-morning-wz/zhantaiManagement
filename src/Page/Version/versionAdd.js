import React, { Component } from 'react';
import { Breadcrumb } from 'antd'
import createhistory from 'history/createHashHistory';
import { Form, Input,Select, Button } from 'antd';
import axios from "../../Axios/index"
import notice from "../../CommonComponent/Notification/Notification"
const history = createhistory();
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class VersionForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            fileHash: '',
            confirmDirty: false,
            appVersionId: window.location.hash.replace("#/", "").split(":")[1],
            autoCompleteResult: [],
            status: '',
        };
    }
    componentDidMount() {
        this.props.form.setFieldsValue({
            minVersionCode: '0',
        });
        if (this.state.appVersionId) {
            let record = JSON.parse(sessionStorage.getItem("record"));
            this.props.form.setFieldsValue({
                platform: record.platform,
                versionName: record.versionName,
                versionCode: record.versionCode,
                releaseNotes: record.releaseNotes,
                updateUrl: record.updateUrl,
                isUpdate: record.isUpdate,
                minVersionCode: record.minVersionCode,
            })
            if (record.isUpdate === '1') {
                this.props.form.setFieldsValue({
                    isUpdate: '1',
                });
            }
            this.setState({ status: record.isUpdate });
            this.setState({ releaseTime: record.releaseTime });
        } else {
            this.props.form.setFieldsValue({
                isUpdate: '0',
            });
            this.setState({ status: '0' });
        }
    }
    componentWillUnmount() {
        if (sessionStorage.record !== undefined) {
            sessionStorage.removeItem("record");
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        let _this = this;
        let userName = JSON.parse(sessionStorage.getItem("userName"));
        if (_this.state.isUpdate === '0') {
            _this.props.form.setFieldsValue({
                minVersionCode: '1',
            });
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(this)
            if (!err) {
                console.log('Received values of form: ', values);
            }else {
                return
            }
            if (_this.state.appVersionId) {
                values.appVersionId = _this.state.appVersionId;
            }
            values.releaseTime = String(new Date());
            values.modifiedPerson = userName;
            axios.post('/addAppVersionOrUpdate', values)
                .then(function (response) {
                    response = response.data
                    if (response.errorCode === "0") {
                        notice("success", '操作成功', "版本" + (_this.state.appVersionId ? "修改" : "添加") + "成功");
                        history.push({ pathname: '/version' })
                    } else {
                        notice("error", '操作失败', response.value)
                    }
                })
                .catch(function (err) {

                });
        });
    }

    /* normFile(e) {
        console.log('Upload event:', e, e.fileList);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    } */
    handleChange(status) {
        this.setState({ status: status });
        this.props.form.setFieldsValue({
            isUpdate: status,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
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
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({ pathname: '/' })}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a
                        onClick={() => history.push({ pathname: '/permission' })}>版本升级管理</a></Breadcrumb.Item>
                    <Breadcrumb.Item>新增版本</Breadcrumb.Item>
                </Breadcrumb>
                <br /><br /><br />
                <FormItem
                    {...formItemLayout}
                    label="客户端"
                >
                    {getFieldDecorator('platform', {
                        rules: [{
                            required: true, message: '请选择客户端',
                        }],
                    })(
                        <Select style={{ width: "100%" }} >
                            <Option value="iphone">iphone</Option>
                            <Option value="android">安卓</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                        版本号
                        </span>)}
                >
                    {getFieldDecorator('versionName', {
                        rules: [{
                            required: true,
                            message: '请输入版本号',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                        识别版本号
                        </span>)}
                >
                    {getFieldDecorator('versionCode', {
                        rules: [{
                            pattern: /^[0-9]*$/,
                            required: true,
                            message: '请输入识别版本号(必须为数字)',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                        更新内容
                        </span>)}
                >
                    {getFieldDecorator('releaseNotes', {
                        rules: [{
                            required: true, message: '请输入更新内容',
                        }],
                    })(
                        <TextArea />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>
                        下载链接
                        </span>)}
                >
                    {getFieldDecorator('updateUrl', {
                        rules: [{
                            type: "string",
                            // pattern: /^(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
                            required: true, message: '请输入正确的下载链接地址',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否强制升级"
                >
                    {getFieldDecorator('isUpdate', {
                        rules: [{
                            required: true, message: '是否强制升级',
                        }],
                        onChange: this.handleChange.bind(this),
                    })(
                        <Select style={{ width: "100%" }}>
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={(<span>
                        支持最低版本
                        </span>)}
                >
                    {getFieldDecorator('minVersionCode', {
                        rules: [{
                            pattern: /^[0-9]*$/,
                            required: true,
                            message: '请输入支持最低版本(必须为数字)',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                    <Button type="primary" htmlType="submit" style={{ width: '150px' }}>确定</Button>
                    <Button style={{ marginLeft: '20px', width: '150px' }} onClick={() => history.push({ pathname: '/version' })}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}

const VersionAdd = Form.create()(VersionForm);

export default VersionAdd;