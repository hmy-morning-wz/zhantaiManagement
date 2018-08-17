import React, {Component} from 'react';
import createhistory from 'history/createHashHistory';
import {Table, Cascader, Divider, Row, Col, Button, Breadcrumb, Select, Modal, Upload, Icon,message} from 'antd';
import notice from "../../CommonComponent/Notification/Notification"
import axios from "../../Axios/index"
import {ALIIMGURL} from "../../common/aliyunImgUrl"
const history = createhistory();
const Option = Select.Option;

class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regionName: "",
            loading: false,
            visible: false,
            columns: [
                {
                    title: '地区ID',
                    dataIndex: 'id',
                    key: 'id',
                }, {
                    title: '地区',
                    dataIndex: 'cityName',
                    key: 'cityName',
                }, {
                    title: '图片',
                    key: 'iconUrl',
                    render: (i, record) => <img style={{width: "50px"}} src={ALIIMGURL+record.iconUrl} alt={""}/>

                }, {
                    title: '地区类型',
                    key: 'areaType',
                    render: (i, record) =>((record.areaType+"" === "2") ? "测试地区" : "线上地区")
                }, {
                    title: '操作',
                    dataIndex: 'handle',
                    key: 'handle',
                    render: (i, record) => !sessionStorage.role.includes("ROLE_ADMIN")?<span>
                        {
                            record.type === 0 && <span>
                         <a href={`/#/region/qualified/${record.id}`}>
                        配置白名单</a>
                          <Divider type="vertical"/>
                    </span>

                        }

                        <a onClick={() => {
                            let arr = [record.level1,];
                            if (record.level2 !== 0) arr.push(record.level2)
                            if (record.level3 !== 0) arr.push(record.level3)
                            this.getChildCity(arr)
                            if(!record.iconUrl.includes(ALIIMGURL)){
                                record.iconUrl=ALIIMGURL+record.iconUrl;
                            }

                            this.setState({
                                id: record.id,
                                visible: true,
                                areaType: record.areaType + "",
                                areaIdList: arr,
                                iconUrl: record.iconUrl,
                                title: "修改地区",
                                fileList: (record.iconUrl ? [{
                                    uid: 1,
                                    name: record.iconUrl,
                                    status: 'done',
                                    url: record.iconUrl,
                                    thumbUrl: record.iconUrl,
                                }] : []),
                            })
                        }}> 编辑 </a>
                 <Divider type="vertical"/>
                <a onClick={() => {
                    Modal.confirm({
                        title: '确定删除吗',
                        content: '删除后无法恢复',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            let _this = this
                            axios.get('/area/del', {params: {id: record.id}})
                                .then(function (res) {
                                    res = res.data
                                    if (res.errorCode !== "0")
                                        return notice("error", "删除失败", res.value)
                                    else {
                                        _this.getTable();
                                        notice("success", "操作成功", "删除成功")
                                    }

                                })
                        }
                    });
                }}> 删除 </a>
            </span>:""
                }
            ],
            options: [],
            title: "添加地区",
            total: 0,
            pageNum: 1,
            areaType: undefined,
            areaIdList: undefined,
            systemList:[],
            systemName:undefined
        }
        this.getTable = () => {
            let _this = this;
            axios.get('/area/getAreaList', {params: {pageNum: _this.state.pageNum, pageSize: 10,systemId:_this.state.systemName,}})
                .then(function (res) {
                    res = res.data
                    if (res.errorCode !== "0") return notice("error", "获取城市列表失败", res.value)
                    _this.setState({
                        data: res.areas || [],
                    })
                })
        }
        this.getSystemList = () => {
            let _this = this;
            axios.get('/getSystemList')
                .then(function (res) {
                    res = res.data
                    if (res.errorCode !== "0") return notice("error", "获取系统失败", res.value)
                    let arr=[]
                    for (const prop in res.data ) {
                        arr.push({key:prop,value:res.data[prop]?res.data[prop]:prop})
                    }
                    console.log(arr)
                    _this.setState({
                        systemList:arr
                    })
                })
        }
        this.getCity = () => {
            let _this = this;
            axios.get('/city/getCity')
                .then(function (res) {
                    res = res.data
                    if (res.errorCode !== "0") return notice("error", "获取城市失败", res.value)
                    let cityList = [];
                    for (let i = 0; i < res.cityList.length; i++) {
                        const city = res.cityList[i];
                        cityList.push({label: city.name, value: city.id, isLeaf: false, level: city.level})
                    }
                    _this.setState({
                        options: cityList
                    })
                })
        }
    }

    componentWillMount() {
        this.getSystemList();
        this.getTable();
        this.getCity();

       /* this.getToken();*/
    }

    getChildCity(str) {
        /*let str="[1,36,409]"*/
        /* str = JSON.parse(str);*/
        let _this = this;
        let flag
        let targetOption
        for (let i = 0; i < _this.state.options.length; i++) {
            if (_this.state.options[i].value === str[0]) {
                targetOption = _this.state.options[i]
                flag = i;
            }
        }
        axios.get('/city/getCity', {params: {id: str[0]}})
            .then(function (res) {
                res = res.data
                if (res.errorCode !== "0") return notice("error", "获取城市失败", res.value)
                targetOption.children = [];
                for (let i = 0; i < res.cityList.length; i++) {
                    const city = res.cityList[i];
                    targetOption.children.push({
                        label: city.name,
                        value: city.id,
                        isLeaf: targetOption.level < 3 ? false : undefined
                    })
                }

                let options = _this.state.options
                options[flag].children = targetOption.children
                _this.setState({
                    options
                });
                if (str.length > 2) {
                    let flag2
                    for (let j = 0; j < options[flag].children.length; j++) {
                        const tc = options[flag].children[j];
                        if (tc.value === str[1]) flag2 = j
                    }
                    axios.get('/city/getCity', {params: {id: str[1]}})
                        .then(function (res2) {
                            let a = {};
                            res2 = res2.data
                            if (res2.errorCode !== "0") return notice("error", "获取城市失败", res2.value)
                            a = [];
                            for (let i = 0; i < res2.cityList.length; i++) {
                                const city = res2.cityList[i];
                                a.push({
                                    label: city.name,
                                    value: city.id,
                                })
                            }
                            let options2 = _this.state.options;
                            options2[flag].children[flag2].children = a;
                            _this.setState({
                                options: options2
                            });

                        })
                }
            })
    }

    handleOk(){
        this.setState({loading: true});
        let _this = this, iconUrl;
        if (this.state.fileHash) {
            iconUrl =  this.state.fileHash;
        } else if (_this.state.iconUrl) {
            iconUrl = _this.state.iconUrl
        } else {
            return notice("error", '图片不存在', "请上传图片")
        }
        if (!_this.state.areaIdList || _this.state.areaIdList.length < 1) return notice("error", '城市未选择', "请选择城市");
        if (!_this.state.areaType) return notice("error", '地区类型不存在', "请选择地区类型")
        axios.post('/area/save', {
            areaType: _this.state.areaType,
            iconUrl: iconUrl.replace(ALIIMGURL,""),
            id: _this.state.id,
            level1: _this.state.areaIdList[0],
            level2: _this.state.areaIdList[1] ? _this.state.areaIdList[1] : 0,
            level3: _this.state.areaIdList[2] ? _this.state.areaIdList[2] : 0,
        })
            .then(function (response) {
                response = response.data;
                if (response.errorCode === "0") {
                    notice("success", '操作成功', "保存成功")
                    _this.getTable();
                    _this.setState({loading: false, visible: false});
                } else {
                    _this.setState({loading: false});
                    notice("error", '操作失败', response.value)
                }
            })
            .catch(function (err) {
            });
    }
    handleCancel(){
        this.setState({visible: false});
    }
    onChange (value){
        this.setState({areaIdList: value})
    }

    loadData(selectedOptions){
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        let _this = this;
        axios.get('/city/getCity', {params: {id: targetOption.value}})
            .then(function (res) {
                res = res.data
                if (res.errorCode !== "0") return notice("error", "获取城市失败", res.value)
                targetOption.children = [];
                for (let i = 0; i < res.cityList.length; i++) {
                    const city = res.cityList[i];
                    targetOption.children.push({
                        label: city.name,
                        value: city.id,
                        isLeaf: targetOption.level < 3 ? false : undefined
                    })
                }
                targetOption.loading = false;

                _this.setState({
                    options: [..._this.state.options],
                });
            })
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
        this.setState({fileList: fileList});
    }

    handleRemove() {
       try {
           this.setState({
               fileHash: '',
               fileList: [],
               iconUrl: undefined
           }, this.props.form.setFieldsValue({iconUrl: undefined}))
       }catch (e) {
           console.log(e)
       }
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
       /* if (!this.state.token) {
            this.getToken();
        }*/
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
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><a onClick={() => history.push({pathname: '/'})}>首页</a></Breadcrumb.Item>
                    <Breadcrumb.Item>地区管理列表</Breadcrumb.Item>
                </Breadcrumb>

                <Row type="flex" justify="space-around" style={{margin: '15px 0'}}>
                    <Col span={12}>
                        {sessionStorage.role.includes("ROLE_ADMIN")?<Select
                            value={this.state.systemName}
                            style={{width: "100%"}}
                            placeholder={"请选择系统"}
                            onSelect={(e)=>{
                                this.setState({systemName:e},this.getTable)
                            }}
                        >
                            {this.state.systemList.map((v,i)=>{
                                return  <Option value={v.key}>
                                    {v.value}
                                </Option>
                            })}
                        </Select>:""}
                    </Col>

                    <Col span={4} offset={8}>
                        {!sessionStorage.role.includes("ROLE_ADMIN")? <Button type="primary" style={{width: '100%'}}
                                onClick={() => {
                                    //console.log(this.state)
                                    this.setState({
                                        title: "添加地区",
                                        id: undefined,
                                        areaType: undefined,
                                        areaIdList: undefined,
                                        iconUrl: undefined,
                                        fileList: undefined,
                                        fileHash: undefined,
                                        visible: true,
                                    })
                                }}>添加地区</Button>:""}
                    </Col>
                </Row>

                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    rowKey={record => record.appId}
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
                    }
                />
                <Modal
                    visible={this.state.visible}
                    title={this.state.title}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Row>
                        <Col span={8} style={{minHeight: "32px", lineHeight: "32px"}}>
                            请选择要添加的地区：
                        </Col>
                        <Col span={10}>
                            <Cascader
                                value={this.state.areaIdList}
                                placeholder="请选择要添加的地区"
                                style={{width: "100%"}}
                                options={this.state.options}
                                loadData={this.loadData.bind(this)}
                                onChange={this.onChange.bind(this)}
                                changeOnSelect
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={8} style={{minHeight: "32px", lineHeight: "32px"}}>
                            请选择地区类型：
                        </Col>
                        <Col span={10}>
                            <Select
                                value={this.state.areaType}
                                style={{width: "100%"}}
                                placeholder="请选择地区类型"
                                onChange={(e) => this.setState({areaType: e})}>
                                <Option value={"1"}>
                                    线上地区
                                </Option>
                                <Option value={"2"}>
                                    测试地区
                                </Option>
                            </Select>
                        </Col>
                    </Row>
                    <br/>

                    <Row>
                        <Col span={8} style={{minHeight: "32px", lineHeight: "32px"}}>
                            请上传地区图片：
                        </Col>
                        <Col span={10}>
                            <Upload name="multipartFile"
                                    action="/stage/api/uploadFile"
                                    listType="picture"
                                    beforeUpload={this.beforeUpload.bind(this)}
                                    onChange={this.handleChange.bind(this)}
                                    onRemove={this.handleRemove.bind(this)}
                                    fileList={this.state.fileList}>
                                <Button>
                                    <Icon type="upload"/> 点击上传
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Modal>
            </div>

        );
    }
}

export default Application;