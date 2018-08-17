import React from 'react'
import Regin from '../Page/Region'
import QualifiedList from '../Page/QualifiedList'
// 1 展台管理
// 2 应用管理
// 3 事项管理
// 4 地区管理
// 5 开发者管理
// 6 部门管理
// 7 banner管理
// 8 主题管理

const routes = [
    {
        name: '地区管理', component: Regin, path:"/region", isExact: true, authorityId: 4,
        children: [
            {
                name: '配置白名单', component: QualifiedList, path:"qualified/:id", isExact: true,
                children: [
                    {
                        name: '配置白名单1', component: QualifiedList, path:"look", isExact: true,
                        children: [
                            {name: '配置白名单2', component: QualifiedList, path:"pppp"},
                        ]
                    },
                ]
            }
        ]
    },
]

/**
 * @param routeData
 * @param routes quote Array
 * @return undefined
 */
const getChildren = (routeData,quote,route)=>{
    const parentPath = route.path;
    for (let i = 0; i < routeData.length; i++) {
        let child = routeData[i];
        child.path = parentPath + "/"+child.path;
        child.authorityId = route.authorityId
        quote.push(child)
        if (Array.isArray(child.children)) {
            getChildren(child.children,quote,child)
            delete child.children
        }
    }
}

for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    const quote = [route];
    if (Array.isArray(route.children)) {
        getChildren(route.children,quote,route)
    }
    delete route.children;
    quote.shift();
    routes.push(...quote)
}

/*console.log(routes);*/

export {routes};