import React, { Component } from 'react';
import {Form, Input, Icon, Button,notification} from 'antd';
import axios from "../../Axios/index"
import "./Login.css"
const notice = (type, message, desc) => {
    notification[type]({
        message: message,
        description: desc,
    });
};
const FormItem = Form.Item;
class NormalLoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.handleSubmit=(e)=>{
            e.preventDefault();
            let _this=this;
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    axios.post('/auth/login', {username:values.userName,password:values.password})
                        .then(function (response) {
                            response=response.data
                            if(response.errorCode==="0") {
                                notice("success", '操作成功', "登录成功");
                                let arr=[];
                                for (let i = 0; i < response.data.length; i++) {
                                    const value =response.data[i]["role_key"];
                                    arr.push(value)
                                }
                                sessionStorage.user="login"
                                let str=JSON.stringify(arr)
                                let set=new Set();
                                //应用管理、展台管理、地区管理、版本升级管理 1,2,3,4
                                //应用管理、应用开发者信息配置 1,5
                                //展台管理、地区管理、版本升级管理、系统信息配置  2,3,4,6
                                if(str.includes("ROLE_ADMIN")){
                                    set.add("1").add("2").add("3").add("4")
                                }
                                if(str.includes("ROLE_DEVELOP")){
                                    set.add("1").add("5")
                                }
                                if(str.includes("ROLE_DOCKING")){
                                    set.add("2").add("3").add("4").add("6")
                                }
                                let roleArr=Array.from(set);
                                sessionStorage.role=str;
                                sessionStorage.roleArr=JSON.stringify(roleArr);
                                _this.props.onLogin();
                            } else {
                                notice("error", '操作失败', response.value);
                                //throw new Error(response.value)
                            }
                        })
                        .catch(function (err) {
                            notice("error",'操作失败',err)
                        });
                }
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form" >
                <p style={{textAlign:'center'}}>展台管理系统登录</p>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="loginFormButton">
                       登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
const Login = (props)=>{
    return (
        <div className={"loginBox"}>
            <div style={{width:"300px"}}>
                <WrappedNormalLoginForm {...props}/>
            </div>
        </div>
    )
}
export default Login;