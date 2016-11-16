import "./css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import PageRoot from "./components/PageRoot";
import "whatwg-fetch";
import {Navigator, Splitter, SplitterContent, Page, SplitterSide, List, ListItem} from "react-onsenui";
import ons from "onsenui";
import ImgCache from "imgcache.js/js/imgcache";

require('onsenui/css/onsenui.css');
require('onsenui/css/onsen-css-components-sunshine-theme.css');
require('./css/theme.styl');

export const ERR_INVALID_QR = 0;
export const ERR_NO_CONNECTION = 1;

/*class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
        };
        if(props.page) {
            this.state.view.page = props.page;
            console.log("Got Page:" + props.page);
        }
    }




    render() {
        return (<PageRoot
            view={this.state.view} status={this.state.status}
                          title={this.state.title} intro={this.state.intro} entries={this.state.entries}
                          baseurl={this.state.baseurl} navigation={this.props.navigation}
                          loadCallback={this.loadData.bind(this)}/>);
    }
}*/

class MainNavigation extends React.Component {

    constructor() {
        super();
        this.state = {
            view: {page: "overview", index: undefined},
            isOpen: false,
            status: {state: 'fetching', msg: undefined},
            title: null,
            intro: null,
            baseurl: null,
            entries: [],
            navigation: {
                pushPage: this.pushPage.bind(this),
                popPage: this.popPage.bind(this),
                openMenu: this.open.bind(this),
                displayError: this.displayError.bind(this),
            }

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        console.log("Reloading");
        this.setState({
            status: {state: 'fetching', msg: undefined}
        });
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


    renderPage(route, navigator) {
        console.log("Rendering Page");
        const props = route.props || {};
        props.navigator = navigator;
        props.route = route;
        props.menuCallback = this.open.bind(this);
        props.navigation = {
            pushPage: this.pushPage.bind(this),
            popPage: this.popPage.bind(this),
            openMenu: this.open.bind(this),
            displayError: this.displayError.bind(this),
        };
        props.loadCallback = this.loadData.bind(this);
        props.status = this.state.status;
        props.title = this.state.title;
        props.intro = this.state.intro;
        props.entries = this.state.entries;
        props.baseurl = this.state.baseurl;


        return React.createElement(route.component, props);
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    openPage(argument) {
        let pageProps;
        switch(argument) {
            case "vernissage":
                pageProps = { view: {
                    page: "overview",
                    index: undefined
                }};
                break;
            case "about":
                pageProps = { view: {
                    page: "about",
                    index: undefined
                }};
                break;
            case "blog":
                window.open("http://weedoocare.tumblr.com/", "_system");
                return;
            case "contact":
                pageProps = { view: {
                    page: "contact",
                    index: undefined
                }};
                break;
        }
        if(pageProps.view.page !== this.state.view.page) {
            this.navigator.replacePage({component: PageRoot, props: pageProps}, {animation: "none"});
        }
        pageProps.isOpen = false;
        this.setState(pageProps);


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
            this.setState({
                view: {
                    page: view, index: index
                }
            });
            this.navigator.pushPage({ component: PageRoot, props: {
                view: {
                    page: view, index: index
                }
            }});
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
        this.navigator.popPage();
    }


    render() {
        return (
        <Splitter>
            <SplitterSide
                style={{
                    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                }}
                side='left'
                width={200}
                collapse={true}
                isSwipeable={true}
                isOpen={this.state.isOpen}
            >
                <Page>
                    <List
                        dataSource={[{title: 'Vernissage', callback: this.openPage.bind(this, 'vernissage')},
                            {title: 'About this App', callback: this.openPage.bind(this, 'about')},
                            {title: 'Our Blog', callback: this.openPage.bind(this, 'blog')},
                            {title: 'Contact', callback: this.openPage.bind(this, 'contact')}]}
                        renderRow={(item) => (
                            <ListItem key={item.title} onClick={item.callback} tappable>{item.title}</ListItem>
                        )}
                    />
                </Page>
            </SplitterSide>
            <SplitterContent>
                <Navigator
                    initialRoute={{component: PageRoot, props: { view: {page: "overview", index: undefined},
                    }}}
                    renderPage={this.renderPage.bind(this)}
                    ref={(navigator) => this.navigator = navigator}
                />
            </SplitterContent>
        </Splitter>

        );
    }
}

function start() {
    //if (!ons.platform.isIOS()) {
    //    ons.platform.select("android");
    //}
    ImgCache.options.debug = true;
    ImgCache.init(function () {
        console.log('ImgCache init: success!');
    }, function () {
        console.log('ImgCache init: error! Check the log for errors');
    });

    ons.ready(function () {
        ReactDOM.render(<MainNavigation />, document.getElementById('app'));
    });

}


if (typeof(cordova) !== 'undefined') {
    document.addEventListener('deviceready', start, false);
} else {
    start();
}

