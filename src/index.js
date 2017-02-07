import "./css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import PageRoot from "./components/PageRoot";
import "whatwg-fetch";
import {
    Navigator,
    Splitter,
    SplitterContent,
    Page,
    SplitterSide,
    List,
    ListItem,
    Input,
    ListHeader
} from "react-onsenui";
import ons from "onsenui";
import ImgCache from "imgcache.js/js/imgcache";

require('onsenui/css/onsenui.css');
require('onsenui/css/onsen-css-components-sunshine-theme.css');
require('./css/theme.styl');

export const ERR_INVALID_QR = 0;
export const ERR_NO_CONNECTION = 1;
export const ERR_INVALID_JSON = 2;

/*
TODO: Pull-to-refresh bei hochscrollen
TODO: Beim ersten öffnen funktioniert das Scrollen nicht (iOS)
 */

class MainNavigation extends React.Component {

    constructor() {
        super();

        this.state = {
            menuIsOpen: false,
            status: {state: 'fetching', msg: undefined},
            title: "Welcome to our digital Vernisage",
            intro: "Content is loading",
            baseurl: null,
            entries: [],
            navigation: {
                pushPage: this.pushPage.bind(this),
                popPage: this.popPage.bind(this),
                openMenu: this.open.bind(this),
                displayError: this.displayError.bind(this),
            },
            language: {
                fallback: 'de',
                possible: ['de', 'en'],
                onChange: this.onLanguageChange.bind(this)
            },
            refresh: this.loadData.bind(this)
        };

        if(typeof(Storage) !== "undefined") {
            if(localStorage.language) {
                this.state.language.inUse = localStorage.language;
                console.log("Use stored language: " + localStorage.language);
                return;
            }
        }

        if(!this.state.language.inUse && typeof(navigator.language) !== "undefined") {
            this.state.language.inUse = navigator.language.split("-")[0].split("_")[0];
            console.log("Use navigator.language");
            console.log("Language is: " + this.state.language.inUse);
        } else {
            this.state.language.inUse = this.state.language.fallback;
            console.log("Use fallback");
            console.log("Language is: " + this.state.language.inUse);
        }
    }

    onLanguageChange(changeEvent) {
        if(typeof(changeEvent) === "undefined") {
            console.log("Event is undefined");
            return;
        }
        let newLang = changeEvent.target.id;
        console.log("Choose language: " + newLang);
        this.setState({language: {
                inUse: newLang,
                fallback: this.state.language.fallback,
                possible: this.state.language.possible,
                onChange: this.onLanguageChange.bind(this)
            }
        });
        if (typeof(Storage) !== "undefined") {
            localStorage.language = newLang;
        }

        this.calculateLocalizedEntries();
    }

    calculateLocalizedEntries() {
        let localizedEntries = [];
        console.log("Calculate entries");
        this.state.entries.forEach((entry) => {
            let localEntry = JSON.parse(JSON.stringify(entry));
            localEntry.title = this.getTranslated(entry.title);
            localEntry.text = this.getTranslated(entry.text);
            localizedEntries.push(localEntry);
        });

        this.setState({localEntries: localizedEntries});
    }

    getTranslated(entry) {
        let localEntry;
        if(typeof(entry) !== "object") {
            console.log("entry not object");
            return "";
        }

        let prefLang = this.state.language.inUse;
        let fallback = this.state.language.fallback;

        if (prefLang in entry) {
            localEntry = entry[prefLang];
        } else if (fallback in entry) {
            localEntry = entry[fallback];
        } else {
            localEntry = entry[0];
        }

        return localEntry;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(doneCallback) {
        console.log("Reloading");
        this.setState({
            status: {state: 'fetching', msg: undefined},
            menuIsOpen: false
        });
        fetch('https://media.weedoocare.com/DigitalVernissage/blog.json')
            .then((response) => {
                ImgCache.clearCache();
                return response.json();
            }).then((vernissage) => {
            setTimeout(function(){
                console.log("Got JSON");

                this.setState({
                    status: {state: 'fetched', msg: undefined},
                    title: vernissage.title,
                    intro: vernissage.intro,
                    entries: vernissage.entries,
                    baseurl: vernissage.baseurl,
                    language: {
                        inUse: this.state.language.inUse,
                        fallback: vernissage.fallback_language,
                        possible: vernissage.languages,
                        onChange: this.onLanguageChange.bind(this)
                    }
                });

                this.calculateLocalizedEntries();

                if (typeof(doneCallback) === "function") {
                    doneCallback();
                }
            }.bind(this), 800);
        }).catch((ex) => {
            console.log(ex.message);
            if (typeof(doneCallback) === "function") {
                doneCallback();
            }

            if(ex.message.indexOf("NetworkError") !== -1) {
                this.displayError(ERR_NO_CONNECTION);
            } else {
                this.displayError(ERR_INVALID_JSON);
            }
        });
    }


    renderPage(route, navigator) {
        console.log("Rendering Page");
        console.log(this.state.intro);
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


        props.title = this.getTranslated(this.state.title || {});
        props.intro = this.getTranslated(this.state.intro || {});

        props.entries = this.state.localEntries || [];
        props.baseurl = this.state.baseurl;
        props.language = this.state.language;

        props.refresh = this.loadData.bind(this);
        return React.createElement(route.component, props);
    }

    open() {
        console.log("open menu");
        this.setState({
            menuIsOpen: true
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
        this.setState({menuIsOpen: false});


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
        } else if (id == ERR_INVALID_JSON) {
            console.log("Got JSON Error");
            this.setState({
                status: {state: 'error', msg: 'There is a server-side problem. Parsing Vernisage data is not possible.'},
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
                    isOpen={this.state.menuIsOpen}
                    swipeTargetWidth={"20px"}
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
                        <List
                            dataSource={this.state.language.possible}
                            renderHeader={() => <ListHeader>Change language</ListHeader>}
                            renderRow={this.renderLanguageRow.bind(this)}
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

    renderLanguageRow(language) {
        return (
            <ListItem key={language} tappable>
                <label className='left'>
                    <Input
                        inputId={`${language}`}
                        checked={language === this.state.language.inUse}
                        onChange={this.state.language.onChange}
                        type='radio'
                    />
                </label>
                <label htmlFor={`${language}`} className='center'>
                    {language}
                </label>
            </ListItem>
        )
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

