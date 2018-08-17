import React, {Component} from 'react';
import {routes} from '../../common/routes'
import * as pattern from '../../utils/pattern'
import { Form, Input, Button,Table,message,Modal,Breadcrumb} from "antd"
import {bindUser,unbindUser,userList} from '../../service/region'
import {addRowsKey,} from '../../utils/util'
import getObj from '../../utils/getDeveloper';
import style from './index.scss';
const FormItem = Form.Item;
const BreadCrumbWrap=Breadcrumb
@Form.create()
export default class QualifiedList extends Component {

    static propTypes = {}

    constructor(props) {
        super(props);
        this.state = {
            curModalOpenText:'',
            currentHandleId:null,
            tableLoading: true,
            tableData: [],
            isErrorRender:false,
            paginationOption:{
                current:1,
                total:0,
            },
        }
    }

    componentWillMount(){
        const id = getObj(this.props,'match.params.id')
        if (!id) throw new Error("don't have a id");
        this.areaId = id;
    }

    componentDidMount(){
        this.reqTableList(1);
    }

    modalForms = [{
        label: '地区ID',
        field: 'id',
        rules:[],
    },{
        label: '地区',
        field: 'name',
        rules:[{required:true,message:"请填写"}],
    }]

    columns = [
        {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
            fixed:'left',
            width:100,
        },{
            title: '用户名',
            dataIndex: 'custName',
            key: 'custName',
            render: (i,r)=>r.customUser?(r.customUser.custName?r.customUser.custName:""):""
        },{
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            render: (i,r)=>r.customUser?(r.customUser.mobile?r.customUser.mobile:""):""
        },{
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render:(i,record)=> <span>
                <a onClick={()=>{this.del(getObj(record,"customUser.custUserId"))}}> 移除 </a>
            </span>

        }
    ]

    clearModal = ()=>{
        this.props.form.resetFields()
        this.setState({
            visibleModal:false,
            curModalOpenText:"",
        })
    }

    handleModalOk = ()=>{
        this.props.form.validateFields((err,values)=>{
            if (err) return;
            const {phone} = values;
            const params = {areaIds:this.areaId,phone};
            bindUser(params).then((res)=>{
                if (res.errorCode === "0") {
                    message.success("添加成功");
                    this.reqTableList(1)
                    this.clearModal();
                }
            })
        });
    }

    reqTableList = (pageNum=1) => {
        this.setState({ tableLoading:true });
        return userList({
            pageNum,
            pageSize:10,
            areaId:this.areaId
        }).then((res)=>{
            console.log(res);
            if (res.errorCode === "0") {
                this.setState({
                    tableData: addRowsKey(res.userAndAreas || []),
                    tableLoading:false,
                    paginationOption:{...this.state.paginationOption,total:res.totalResult}
                })
            }
        })
    }

    del = (id)=>{
        if (!id) return;
        unbindUser({userId:id,areaId:this.areaId}).then((res)=>{
            if (res.errorCode === "0") {
                message.success("删除成功")
                this.reqTableList(this.state.paginationOption.current)
            }
        })
    }

    createRegion = (id)=> {
        this.setState({
            currentHandleId: id,
            curModalOpenText: "添加用户",
            visibleModal: true,
        })
    }
    paginationChange = (n)=>{
        this.setState({
            paginationOption:Object.assign(this.state.paginationOption,{current:n})
        });
        this.reqTableList(n);
    }

    render() {
        const {tableLoading,tableData,paginationOption,visibleModal,curModalOpenText} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 }
            }
        };

        console.log(this.props.match);

        return <React.Fragment>
            <BreadCrumbWrap
                defaultBreadCrumb={{path:'/',key:'/',breadcrumbName:"首页"}}
                match={this.props.match}
                routes={routes}
            />
            <header className={style['header-right']}>
                <Button htmlType="submit" onClick={this.createRegion}> 添加用户 </Button>
            </header>
            <section>
                <Table
                    columns={this.columns}
                    loading={tableLoading}
                    dataSource={tableData}
                    pagination={{
                        ...paginationOption,
                        onChange:this.paginationChange
                    }}
                />
            </section>
            <Modal
                className={style.modalForms}
                title={curModalOpenText}
                visible={visibleModal}
                onCancel={this.clearModal}
                onOk={this.handleModalOk}
                okText="保存"
                cancelText="取消"
            >
                <Form layout="inline" className={style['form-center']}>
                    <FormItem label='手机号' key='phone' {...formItemLayout}>
                        {
                            getFieldDecorator('phone',{
                                rules: [
                                    {required:true,message:"请输入"},
                                    {pattern: pattern.phone, message:"输入格式错误"}
                                ],
                            })(
                                <Input size="default" placeholder={`请填写要添加用户的手机号`} maxLength="11"/>
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>
        </React.Fragment>
    }
}