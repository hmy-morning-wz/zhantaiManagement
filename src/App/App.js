import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import './App.css';
import Router from "../Router/Router"
import MenuList from "../SideBar/SideBar"
import Login from "../Page/Login/Login"
import createhistory from 'history/createHashHistory';
import axios from "../Axios/index"
import EventManager from "../common/EventManager"
const history = createhistory();
const {Content, Header, Sider} = Layout;
const SubMenu = Menu.SubMenu;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
        }
    }

    componentWillMount() {
        let _this=this;
        EventManager.on("logout",function () {
            sessionStorage.removeItem("user")
            _this.setState({login:false})
        })
        if (sessionStorage.user !== undefined) {
            if (this.state.login === true) {

            } else {
                this.setState({login: true});
            }
        }
    }


    showMenu (menu){
        if(menu.role&&!sessionStorage.roleArr.includes(menu.role))return;
        if (menu.child) {
            return (
                <SubMenu key={menu.menuUrl}
                         title={<span><Icon type={"upload"}/><span>{menu.menuName}</span></span>}>
                    {
                        menu.child.map((v)=>this.showMenu(v))
                    }
                </SubMenu>
            )
        } else {
            return (
                <Menu.Item key={menu.menuUrl}>
                    <Icon type={menu.icon}/>
                    <span className="nav-text">{menu.menuName}</span>
                </Menu.Item>
            )
        }
    }

    startLogin(){
       /* const userInfo = sessionStorage.getItem('user')*/
        this.setState({
            login: true,
        },history.push({pathname:"/"}))
    }

    exit(){
        sessionStorage.removeItem('user')
        let _this = this;
        axios.post('/auth/logout')
            .then((response) => {
                response = response.data
                if (response.errorCode === "0") {
                    _this.setState({login: false})
                } else {
                    _this.setState({login: false})
                    //notice("error", '获取失败', response.value)
                }
            })
            .catch(function (err) {
                _this.setState({login: false})
                console.log('catch some err', err);
            });

    }

    render() {
        if (this.state.login) {
            return (
                <Layout>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        onCollapse={(collapsed, type) => {
                            /*console.log(collapsed, type);*/
                        }}
                    >
                        <div className={"headerTitle"}>后台管理系统</div>
                        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']} onClick={(a) => {
                            sessionStorage.pageNum=1;
                            history.push({pathname: a.key})
                        }}>
                            {MenuList.map((v)=>this.showMenu(v))}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff'}}>
                            <ul className="nav-menu-list clear-both">
                                <li onClick={this.exit.bind(this)} className="header-message">
                                    <a> 退出 </a>
                                </li>
                            </ul>
                        </Header>
                        <Content style={{margin: '24px 16px 0'}}>
                            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                                <Router/>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            );
        } else {
            return (
                <Login onLogin={this.startLogin.bind(this)}/>
            )
        }
    }
}

export default App;
