import React  from 'react';
import {Switch, Route, Redirect, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

import Auth from '../../containers/Auth/Auth';
import Todos from '../../containers/Todos/Todos';
import Logout from '../../containers/Auth/Logout/Logout';
import './Layout.css';

const layout = (props) => {
    let routes = (
        <Switch>
            <Route path = "/auth" component = {Auth}/>
            <Redirect to = "/auth" />
        </Switch>
    )
    if(props.isLoggedIn){
        routes = (
            <Switch>
                <Route exact path = "/todos" component ={Todos}/>
                <Route exact path = "/logout" component = {Logout}/>
                <Redirect to = "/todos"/>
            </Switch>
        )   
    }
    return (
        <div>
            {routes}
        </div>
    )

}

const mapStateToProps = state => {
    return{
        isLoggedIn : state.auth.isLoggedIn
    }
}

export default withRouter(connect(mapStateToProps)(layout));