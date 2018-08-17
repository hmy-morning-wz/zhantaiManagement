import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Form, Input, Tooltip, Icon, Select, Button, Upload, Breadcrumb, message} from 'antd';
import notice from "../../CommonComponent/Notification/Notification"
import axios from "../../Axios/index"
/*import {QiniuUrl as QINIU_URL} from "../../common/qiniuUrl"*/
/*import {ALIIMGURL} from "../../common/aliyunImgUrl"*/
const history = createhistory();
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class RegistrationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            fileHash: '',
            fileList: [],
            iconUrl: '',
            confirmDirty: false,
            appId: window.location.hash.replace("#/", "").split(":")[1],
            canUploadImg: true
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        if (sessionStorage.record) {
            let record = JSON.parse(sessionStorage.getItem("record"));
            this.setState({
                appId: record.appId,
                id: record.id,
                iconUrl: record.iconUrl,
                fileList: (record.appId ? [{
                    uid: record.iconUrl,
                    name: record.iconUrl,
                    status: 'done',
                    url: record.iconUrl,
                    thumbUrl: record.iconUrl,
                }] : [])
            })
            this.props.form.setFieldsValue({
                applicationName: record.applicationName,
                remark: record.remark,
                iconUrl: record.iconUrl,
                appType: record.appType,
                publicKey:record.publicKey,
                jumpUrl: record.jumpUrl,
                appStatus: (record.appStatus).toString(),
                version: record.version,
                interfaceUrl:record.interfaceUrl
            })

        }
    }

    componentWillUnmount() {
        if (sessionStorage.record) {
            sessionStorage.removeItem("record");
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            } else {
                return
            }
            if (_this.state.appId) {
                console.log('..');
            } else {
                if (!_this.state.fileHash) {
                    notice("error", '提交失败', '请上传图片');
                    return;
                }
            }
            if (_this.state.appId) {
                values.appId = _this.state.appId;
                values.id = _this.state.id;
            }
            if (!_this.state.canUploadImg) {

            } else {
                if (_this.state.fileHash) {
                    values.iconUrl =  _this.state.fileHash;
                } else {
                    values.iconUrl = _this.state.iconUrl;
                }
            }
            axios.post('/addAppOrUpdate', values)
                .then(function (response) {
                    response = response.data
                    if (response.errorCode === "0") {
                        notice("success", '操作成功', "应用" + (_this.state.appId ? "修改" : "添加") + "成功");
                        history.push({
                            pathname: '/application'
                        })
                    } else {
                        notice("error", '操作失败', response.value)
                    }
                })
                .catch(function (err) {
                });
        });
    }

    handleChange(info) {
        let fileList = info.fileList;
        if (info.file.status === 'uploading') {
            //this.setState({ loading: true });
        } else if (info.file.status === 'done') {
            if (fileList.length > 1) {
                fileList = [fileList[1]];
            }
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
            // this.state.fileHash
            this.setState({fileHash: info.file.response.fileName})
        }
        console.log("filelist", fileList)
        this.setState({fileList: fileList});
    }

    handleRemove() {
        this.setState({
            fileHash: '',
            fileList: [],
            iconUrl: undefined
        }, this.props.form.setFieldsValue({iconUrl: undefined}))
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;

    }

    normFile(e) {
        console.log('Upload event:', e, e.target.value);
        if (Array.isArray(e)) {
            return e;
        }
        if (e.target.value) {
            return e && e.target.value;
        }
        return e && e.fileList;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 8
                },
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 10
                },
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
                    <Breadcrumb.Item>
                        <a onClick={() => history.push({
                            pathname: '/'
                        })}>首页</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a onClick={() => history.push({
                            pathname: '/application'
                        })}>应用管理列表</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {this.state.appId ? "应用详情修改" : "应用创建"}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br/>
                <br/>
                <br/>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>应用名&nbsp; <Tooltip title="用以区分应用名"> <Icon type="question-circle-o"/> </Tooltip></span>)}>
                    {getFieldDecorator('applicationName', {
                        rules: [{
                            required: true,
                            message: '请输入应用名',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>应用版本&nbsp; <Tooltip title="例：1.0.0，适用应用版本"> <Icon type="question-circle-o"/> </Tooltip></span>)}>
                    {getFieldDecorator('version', {
                        rules: [{
                            required: true,
                            message: '请输入应用版本',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>应用地址&nbsp; <Tooltip title="配置好的应用地址"> <Icon
                        type="question-circle-o"/> </Tooltip></span>)}>
                    {getFieldDecorator('jumpUrl', {
                        rules: [{
                            required: true,
                            message: '请输入应用地址',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>应用公钥</span>)}>
                    {getFieldDecorator('publicKey', {
                        rules: [{
                            required: false,
                            message: '请输入应用公钥',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>应用回调地址 </span>)}>
                    {getFieldDecorator('interfaceUrl', {
                        rules: [{
                            required: false,
                            message: '请输入应用回调地址',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="应用类别">
                    {getFieldDecorator('appType', {
                        rules: [{
                            required: true,
                            message: '请选择应用类别!',
                        }],
                    })(
                        <Select style={{width: "100%"}}>
                            <Option value="NativeApp">
                                NativeApp
                            </Option>
                            <Option value="H5App">
                                H5App
                            </Option>
                            <Option value="H5">
                                H5
                            </Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="应用状态">
                    {getFieldDecorator('appStatus', {
                        initialValue:"1",
                        rules: [{
                            required: true,
                            message: '请选择应用状态!',
                        }],
                    })(
                        <Select style={{width: "100%"}}>
                            <Option value="0">
                                启用
                            </Option>
                            <Option value="1">
                                禁用
                            </Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={(<span className="ant-form-item-required">应用图标</span>)}>
                    {/* <Switch checkedChildren="上传" unCheckedChildren="输入" defaultChecked onChange={(a) => this.setState({ canUploadImg: a })} />
                    <br />*/}
                    <div className="dropbox">
                        {getFieldDecorator('iconUrl', {
                            valuePropName: this.state.canUploadImg ? 'fileList' : "value",
                            getValueFromEvent: this.normFile,
                        })(
                            this.state.canUploadImg ?
                                <div className="clearfix">
                                    <Upload name="multipartFile"
                                            action="/stage/api/uploadFile"
                                            listType="picture"
                                            data={{token: this.state.token}}
                                            beforeUpload={this.beforeUpload.bind(this)}
                                            onChange={this.handleChange.bind(this)}
                                            onRemove={this.handleRemove.bind(this)}
                                            fileList={this.state.fileList}>
                                        <Button>
                                            <Icon type="upload"/> 点击上传
                                        </Button>
                                    </Upload>
                                </div>
                                : <Input/>
                        )}
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(<span>应用描述&nbsp; <Tooltip title="记录应用详细信息"> <Icon
                        type="question-circle-o"/> </Tooltip></span>)}>
                    {getFieldDecorator('remark', {
                        rules: [{
                            required: true,
                            message: '请输入应用描述',
                        }],
                    })(
                        <TextArea/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{width: '150px'}}>
                        确定
                    </Button>
                    <Button
                        style={{marginLeft: '20px', width: '150px'}}
                        onClick={() => history.push({pathname: '/application'})}> 取消
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const ApplicationChange = Form.create()(RegistrationForm);

export default ApplicationChange;