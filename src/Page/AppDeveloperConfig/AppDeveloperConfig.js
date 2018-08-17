import React, {Component} from 'react';
/*import createhistory from 'history/createHashHistory';*/
import {Button, Col, Row, Input, Radio} from 'antd';
import notice from "../../CommonComponent/Notification/Notification"
import axios from "../../Axios/index"
import EditableTagGroup from "./EditableTagGroup"

/*const history = createhistory();*/
const RadioGroup = Radio.Group;

class AppDeveloperConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            aesKey:"",
            ip:[],
            messageType:1,
            name:""
        };
    }

    componentWillMount() {
        this.getDeveloper();
    }
    getDeveloper(){
        let _this=this
        axios.get('/getDeveloper')
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    _this.setState({
                        aesKey: response.data.aesKey,
                        ip: response.data.ip?JSON.parse(response.data.ip):"",
                        messageType:response.data.messageType,
                        name: response.data.name,
                    })
                } else {
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {

            });
    }
    saveDeveloper() {
        let _this = this;
        axios.post('/configDeveloper', {
            "aesKey": _this.state.aesKey,
            "ip": JSON.stringify(_this.state.ip),
            "messageType": _this.state.messageType,
            "name": _this.state.name,
        })
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    notice("success",'操作成功',"保存成功");
                } else {
                    notice("error", '失败', response.value)
                }
            })
            .catch(function (err) {

            });
    }
    randomString(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    render() {
        const colSpan = {
            left: 6,
            right: 14,
            styleLeft: {textAlign: "right", paddingRight: "10px", height: "32px", lineHeight: "32px"},
            styleRight: {minHeight: "32px", lineHeight: "32px"}
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div>
                <p style={{fontSize: "28px", textAlign: "center"}}>应用开发者信息配置</p>
                <Row>
                    <Col span={colSpan.left} style={colSpan.styleLeft}>开发者名称 : </Col>
                    <Col span={colSpan.right} style={colSpan.styleRight}>
                        <Input value={this.state.name} onChange={(e)=>{
                            this.setState({name: e.target.value})
                           }}/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={colSpan.left} style={colSpan.styleLeft}>IP白名单 : </Col>
                    <Col span={colSpan.right} style={colSpan.styleRight}>
                        <p style={{fontSize: "12px", color: "#aaa"}}>通过APPID及应用公钥调用接口时，需要设置访问来源IP为白名单</p>
                        <EditableTagGroup value={this.state.ip} onChange={(tags) => {
                          this.setState({ip:tags})
                        }} />
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={colSpan.left} style={colSpan.styleLeft}>消息加解密密钥 : </Col>
                    <Col span={colSpan.right} style={colSpan.styleRight}>
                        <Input style={{float:"left",width:"70%"}} value={this.state.aesKey} onChange={(e)=>{
                            this.setState({aesKey: e.target.value})
                        }}/>
                        <Button
                            style={{float:"right",width:"25%"}}
                            onClick={()=>{
                                this.setState({aesKey:this.randomString()})
                            }}
                        >随机生成</Button>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={colSpan.left} style={colSpan.styleLeft}>消息加解密方式 : </Col>
                    <Col span={colSpan.right} style={colSpan.styleRight}>
                        <RadioGroup onChange={(e)=>{
                            this.setState({messageType:e.target.value})
                        }} value={this.state.messageType}>
                            <p>请根据业务需要，选择消息加密解密类型启用后将立即生效</p>
                            <Radio style={radioStyle} value={1}>明文模式</Radio>
                            <p style={{fontSize: "12px", color: "#aaa", textIndent: "2em"}}>明文模式下，不使用消息加解密，安全系数较低</p>
                            <Radio style={radioStyle} value={2}>兼容模式</Radio>
                            <p style={{fontSize: "12px", color: "#aaa", textIndent: "2em"}}>兼容模式下，明文密文将共存，方便开发者调试和维护</p>
                            <Radio style={radioStyle} value={3}>安全模式（推荐）</Radio>
                            <p style={{
                                fontSize: "12px",
                                color: "#aaa",
                                textIndent: "2em"
                            }}>安全模式下，消息包为纯密文，需要开发者加密解密，安全系数高</p>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={colSpan.left} style={colSpan.styleLeft}>

                    </Col>
                    <Col span={colSpan.right} style={colSpan.styleRight}>
                        <Button type="primary" style={{width: '150px'}} onClick={this.saveDeveloper.bind(this)}>保存</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default AppDeveloperConfig;