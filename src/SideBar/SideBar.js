const MenuList = [{
    menuName: '应用管理',
    menuUrl: '/application',
    icon: 'user',
    role:'1'
},{
    menuName: '展台管理',
    menuUrl: '',
    icon: 'user',
    role:'2',
    child: [{
        menuName: '父展台管理',
        menuUrl: '/parentStage',
        icon: 'user',

    }, {
        menuName: '子展台管理',
        menuUrl: '/childrenStage',
        icon: 'user',

    }]
}, {
    menuName: '地区管理',
    menuUrl: '/region',
    icon: 'user',
    role:'3',
}, {
    menuName: '版本升级管理',
    menuUrl: '/version',
    icon: 'user',
    role:'4',
}, {
    menuName: '应用开发者信息配置',
    menuUrl: '/appDeveloperConfig',
    icon: 'user',
    role:'5',
},{
    menuName: '系统信息配置',
    menuUrl: '/systemConfig',
    icon: 'user',
    role:'6',
}]

export default MenuList;
//应用管理、展台管理、地区管理、版本升级管理 1,2,3,4
//应用管理、应用开发者信息配置 1,5
//展台管理、地区管理、版本升级管理、系统信息配置  2,3,4,6