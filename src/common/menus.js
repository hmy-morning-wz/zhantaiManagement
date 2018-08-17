
const menuData = [
    {
        name: '权限角色管理',
        path: '/permission',
        icon: 'user',
    },
    {
        name: '展台管理',
        path: '/showPlatform',
        icon: 'user',
    },
    {
        name: '应用管理',
        path: '/application',
        icon: 'user',
    },{
        name: '地区管理',
        path: '/region',
        icon: 'upload',
        children: []
    },{
        name: '意见反馈',
        path: '/Opinion',
        icon: 'upload'
    }
]


function formatter(data, parentPath = '', parentAuthority) {
    return data.map((item) => {
        const result = {
            ...item,
            path: `${parentPath}${item.path}`,
            authority: item.authority || parentAuthority,
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
        }
        return result;
    });
}

export const getMenuData = () => formatter(menuData);