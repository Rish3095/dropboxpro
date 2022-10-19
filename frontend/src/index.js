import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import S3Data from './components/S3Data';
import {createBrowserHistory} from 'history';
import { Router as BrowserRouter, Switch, Route } from 'react-router-dom';

const applicationBrowserHistory =  createBrowserHistory();
const routeApplicationPath = (
    <BrowserRouter history={applicationBrowserHistory}>
        <div>
            <Switch>
                <Route path="/" component={App}/>
                <Route path="/user" component={S3Data} />
            </Switch>
        </div>
    </BrowserRouter>
)

ReactDOM.render(routeApplicationPath, document.getElementById('root'));

serviceWorker.unregister();
