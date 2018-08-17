import React, {Component} from 'react';
import {Breadcrumb} from 'antd'
import createhistory from 'history/createHashHistory';
import {Form, Input, Tooltip, Icon, Select, Button} from 'antd';
import axios from "../../../Axios/index"
import notice from "../../../CommonComponent/Notification/Notification"
const history = createhistory();
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class RegistrationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
        };
        this.handleSubmit = (e) => {
            e.preventDefault();
            let _this=this;
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    if(_this.state.stageId){
                        values.id=_this.state.stageId;
                    }
                    if(values.status==="停用"||values.status==="1"||values.status===1){
                        values.status="1"
                    }else{
                        values.status="0"
                    }
                    axios.post('/addChildStageOrUpdate', values)
                        .then(function (response) {
                            response=response.data;
                            if(response.errorCode==="0"){
                                notice("success",'操作成功',"子展台"+(_this.state.stageId?"修改":"添加")+"成功");
                                history.push({pathname:'/childrenStage'})
                            }else {
                                notice("error",'操作失败',response.value)
                            }
                        })
                        .catch(function (err) {

                        });
                }
            });
        }
    }
    componentDidMount(){
        if(sessionStorage.record!==undefined){
            let record = JSON.parse(sessionStorage.getItem("record"));
            this.setState({stageId:record.id})
            this.props.form.setFieldsValue({
                childStageName:record.childStageName,
                remark:record.remark,
                stageId:record.id,
                status:(record.status+"")==="1"?"停用":"启用",
            })
        }

    }
    componentWillUnmount(){
        if(sessionStorage.record!==undefined){
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
                        onClick={() => history.push({pathname: '/childrenStage'})}>子展台管理列表</a></Breadcrumb.Item>
                    <Breadcrumb.Item>子展台详情修改</Breadcrumb.Item>
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
                    {getFieldDecorator('childStageName', {
                        rules: [{
                            required: true, message: '请输入展台名',
                        }],
                    })(
                        <Input/>
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
                        <Select  style={{ width: "100%" }}>
                            <Option value="1">停用</Option>
                            <Option value="0">启用</Option>
                        </Select>
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
                    <Button type="primary" htmlType="submit" style={{width:'150px'}}>确定</Button>
                    <Button  style={{marginLeft:'20px',width:'150px'}} onClick={() => history.push({pathname: '/childrenStage'})}>取消</Button>
                </FormItem>
            </Form>
        );
    }
}

const ChildrenStageChange = Form.create()(RegistrationForm);

export default ChildrenStageChange;