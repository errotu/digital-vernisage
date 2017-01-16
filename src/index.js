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

/*
 Multi-Sprache ✓
 Bild nicht im Video ✓
 Versionsnummer in About ✓
 "Tap to detail" nur einmal am Tag ✓
 TODO: Pull-to-refresh
 TODO: QR-Code auf App-Store weiterleiten
 */

class MainNavigation extends React.Component {

    constructor() {
        super();

        this.state = {
            fallback: 'de',
            possibleLanguages: ['de', 'en'],
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

        if(typeof(Storage) !== "undefined") {
            if(localStorage.language) {
                this.state.language = localStorage.language;
            }
        }

        if(!this.state.language && typeof(navigator.language) !== "undefined") {
            this.state.language = navigator.language.split("-")[0].split("_")[0];
            console.log("Use navigator.language");
            console.log("Language is: " + this.state.language);
        } else {
            this.state.language = "en";
            console.log("Use fallback");
            console.log("Language is: " + this.state.language);
        }


    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        console.log("Reloading");
        this.setState({
            status: {state: 'fetching', msg: undefined}
        });
        fetch('https://media.weedoocare.com/DigitalVernissage/sample.json')
            .then((response) => {
                return response.json();
            }).then((vernissage) => {
            console.log("Got JSON");

            this.setState({
                fallback: vernissage.fallback_language,
                possibleLanguages: vernissage.languages,
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


        if (this.state.title != null) {
            props.title = this.state.title[this.state.language];
        }
        if (this.state.intro != null) {
            props.intro = this.state.intro[this.state.language];
        }

        let localEntries = [];
        this.state.entries.forEach((entry) => {
            console.log("Calculate entries");
            let localEntry = JSON.parse(JSON.stringify(entry));
            console.log(entry);
            if (this.state.language in entry.title) {
                localEntry.title = entry.title[this.state.language];
            } else {
                localEntry.title = entry.title[this.state.fallback];
            }

            if (this.state.language in entry.text) {
                localEntry.text = entry.text[this.state.language];
            } else {
                localEntry.text = entry.text[this.state.fallback];
            }
            localEntries.push(localEntry);
        });

        props.entries = localEntries;
        props.baseurl = this.state.baseurl;

        props.language = {
            inUse: this.state.language,
            possible: this.state.possibleLanguages,
            onChange: (target) => {
                console.log(target.currentTarget.value);
                this.setState({language: target.currentTarget.value});
                if(typeof(Storage) !== "undefined") {
                    localStorage.language = target.currentTarget.value;
                }

            }
        };

        return React.createElement(route.component, props);
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    openPage(argument) {
        let pageProps;
        switch (argument) {
            case "vernissage":
                pageProps = {
                    view: {
                        page: "overview",
                        index: undefined
                    }
                };
                break;
            case "about":
                pageProps = {
                    view: {
                        page: "about",
                        index: undefined
                    }
                };
                break;
            case "blog":
                window.open("http://weedoocare.tumblr.com/", "_system");
                return;
            case "contact":
                pageProps = {
                    view: {
                        page: "contact",
                        index: undefined
                    }
                };
                break;
        }

        this.navigator.replacePage({component: PageRoot, props: pageProps}, {animation: "none"});
        this.setState({isOpen: false});


    }

    pushPage(view, index) {
        if (view == 'qr-code' && index !== undefined && index.length > 0) {
            let success = false;
            this.state.entries.map((entry, entryIndex) => {
                if (entry.url === index) {
                    this.pushPage("detail", entryIndex);
                    success = true;
                }
            });
            if (!success) {
                console.log("Invalid QR-Code: " + index);
                this.displayError(ERR_INVALID_QR);
            }
        } else {
            console.log("Pushing " + view + " to " + index);
            this.navigator.pushPage({
                component: PageRoot, props: {
                    view: {
                        page: view, index: index
                    }
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
                        initialRoute={{
                            component: PageRoot, props: {
                                view: {page: "overview", index: undefined},
                            }
                        }}
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
    if (typeof(cordova) !== "undefined") {
        window.open = cordova.InAppBrowser.open;
    }

}


if (typeof(cordova) !== 'undefined') {
    document.addEventListener('deviceready', start, false);
} else {
    start();
}

