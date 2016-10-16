import "./css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import PageRoot from "./components/PageRoot";
import "whatwg-fetch";
import {Navigator} from "react-onsenui";
import ons from "onsenui";
import ImgCache from "imgcache.js/js/imgcache";

require('onsenui/css/onsenui.css');
require('onsenui/css/onsen-css-components-sunshine-theme.css');
require('./css/theme.styl');

export const ERR_INVALID_QR = 0;
export const ERR_NO_CONNECTION = 1;

class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
            status: {state: 'fetching', msg: undefined},
            title: null,
            intro: null,
            baseurl: null,
            entries: [],
            view: {page: "overview", index: null},
            navigation: {
                pushPage: this.pushPage.bind(this),
                popPage: this.popPage.bind(this),
                displayError: this.displayError.bind(this),
            }
        };
        this.loadData();
    }

    loadData() {
        fetch('https://weedocare.eknoes.de/blog.json')
            .then((response) => {
                return response.json();
            }).then((vernissage) => {
            console.log("Got JSON");
            this.setState({
                status: {state: 'fetched', msg: undefined},
                title: vernissage.title,
                intro: vernissage.intro,
                entries: vernissage.entries,
                baseurl: vernissage.baseurl
            });
        }).catch((ex) => {
            console.log('parsing failed', ex.message);
            this.displayError(ERR_NO_CONNECTION);
        });
    }

    pushPage(view, index) {
        if (view == 'qr-code' && index !== undefined && index.length > 0) {
            let success = false;
            this.state.entries.map((entry, entryIndex) => {
                if(entry.url === index) {
                    this.pushPage("detail", entryIndex);
                    success = true;
                }
            });
            if(!success) {
                console.log("Invalid QR-Code: " + index);
                this.displayError(ERR_INVALID_QR);
            }
        } else {
            console.log("Pushing " + view + " to " + index);
            this.props.navigator.pushPage({
                component: PageRoot,
                props: {
                    navigation: this.state.navigation,
                    view: {page: view, index: index},
                    status: this.state.status,
                    entries: this.state.entries,
                    baseurl: this.state.baseurl,
                }
            });
        }

    }

    displayError(id) {
        if (id == ERR_INVALID_QR) {
            console.log("Got Invalid QR Error");
            ons.notification.alert('This QR Code is not for use with the Digital Vernissage App!', {modifier: ons.platform.isIOS ? null : "material"});
        } else if (id == ERR_NO_CONNECTION) {
            console.log("Got No Connection Error");
            this.setState({
                status: {state: 'error', msg: 'No connection.'},
            });
        }
    }

    popPage() {
        this.props.navigator.popPage();
    }


    render() {
        return (<PageRoot view={this.state.view} status={this.state.status}
                          title={this.state.title} intro={this.state.intro} entries={this.state.entries}
                          baseurl={this.state.baseurl} navigation={this.state.navigation}/>);
    }
}

class MainNavigation extends React.Component {

    renderPage(route, navigator) {
        const props = route.props || {};
        props.navigator = navigator;
        props.route = route;
        console.log("renderPage called");
        return React.createElement(route.component, props);
    }

    render() {
        return (
            <Navigator
                initialRoute={{component: App}}
                renderPage={this.renderPage.bind(this)}
            />
        );
    }
}
function start() {
    "use strict";
    if (!ons.platform.isIOS()) {
        ons.platform.select("android");
    }

    ImgCache.options.debug = true;

    ImgCache.init(function () {
        console.log('ImgCache init: success!');
    }, function () {
        console.log('ImgCache init: error! Check the log for errors');
    });
    ReactDOM.render(<MainNavigation />, document.getElementById('app'));
}

if (typeof(cordova) !== 'undefined') {
    document.addEventListener('deviceready', start, false);
} else {
    start();
}

