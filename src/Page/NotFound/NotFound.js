import React, { Component } from 'react';
import {Row,Col} from "antd"
class Model extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div >
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={10} offset={0}><img src={require("./notFound.png")} style={{width:'100%'}} alt=""/></Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={8} offset={3} style={{fontSize:"36px",marginTop:'30px'}}>页面不见了！！</Col>
                </Row>
            </div>

        );
    }
}
export default Model;