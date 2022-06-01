import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/Login';

import Principal from './pages/principal';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/principal" component={Principal}/>
            </Switch>
        </BrowserRouter>
    );
}