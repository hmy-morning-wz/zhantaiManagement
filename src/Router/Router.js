import React from 'react'
import {HashRouter as Router ,Route,Switch} from 'react-router-dom'
import Home from "../Page/Home/Home.js"
import Application from "../Page/Application/Application.js"
import ApplicationChange from "../Page/Application/ApplicationChange.js"
import ChildrenStage from "../Page/StageManager/ChildrenStage/ChildrenStage"
import ChildrenStageChange from '../Page/StageManager/ChildrenStage/ChildrenStageChange'
import ChildrenStageDetail from '../Page/StageManager/ChildrenStage/ChildrenStageDetail'
import ParentStage from "../Page/StageManager/ParentStage/ParentStage"
import ParentStageChange from '../Page/StageManager/ParentStage/ParentStageChange'
import ParentStageDetail from '../Page/StageManager/ParentStage/ParentStageDetail'
import Version from "../Page/Version/version.js"
import VersionAdd from "../Page/Version/versionAdd.js"
import NotFound from "../Page/NotFound/NotFound"
import AppDeveloperConfig from "../Page/AppDeveloperConfig/AppDeveloperConfig.js"
import SystemConfig from "../Page/SystemConfig/SystemConfig.js"
import Region from "../Page/Region/Region.js"


const RouterBasic = () => (
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/application" component={Application}/>
                <Route path="/applicationChange:id" component={ApplicationChange}/>
                <Route path="/childrenStage" component={ChildrenStage}/>
                <Route path="/childrenStageChange:id" component={ChildrenStageChange}/>
                <Route path="/childrenStageDetail:id" component={ChildrenStageDetail}/>
                <Route path="/parentStage" component={ParentStage}/>
                <Route path="/parentStageChange:id" component={ParentStageChange}/>
                <Route path="/parentStageDetail:id" component={ParentStageDetail}/>
                <Route path="/version" component={Version}/>
                <Route path="/versionAdd:id" component={VersionAdd}/>
                <Route path="/appDeveloperConfig" component={AppDeveloperConfig} />
                <Route path="/systemConfig" component={SystemConfig} />
                <Route path="/region" component={Region} />
               {/* {
                    authorityWrapFilter(routes,authorityIds,route => <Route path={route.path} key={route.path} component={route.component} exact={route.isExact} />)
                }*/}
                <Route component={NotFound}/>
            </Switch>
        </Router>
    )

export default RouterBasic;