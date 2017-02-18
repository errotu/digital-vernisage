import React from "react";
import Intro from "./Intro";
import OverviewGrid from "./OverviewGrid";
import Swiper from "./Swiper";
import Detail from "./Detail";
import About from "./About";
import Contact from "./Contact";
import Toolbar from "./Toolbar";
import QRButton from "./QRButton";
import {Page, ProgressCircular, PullHook} from "react-onsenui";

export default class PageRoot extends React.Component {

    pageWrapper(a, b, c, d) {
        return(<Page
            style={{height: "100%",
            overflow: "scroll",
            overflowY: "scroll"}}
            key={this.props.view.page + this.props.view.index}
                     renderToolbar={() => <Toolbar view={this.props.view} navigation={this.props.navigation}
                                                   backButton={this.props.view.index !== undefined}/>}
                     renderFixed={() => (this.props.status.state != "error" && this.props.status.state != "fetching") ?
                         <QRButton
                             navigation={this.props.navigation}/> : null}>
            {a}
            {b}
            {c}
            {d}
        </Page>)
    }

    render() {

        if (this.props.view.page == "overview") {
            if (this.props.status.state == "fetching") {
                return this.pageWrapper(<div className="content centered"> <ProgressCircular indeterminate/><p>Loading data</p></div>);
            } else if (this.props.status.state == "fetched") {
                return this.pageWrapper(
                    <PullHook
                        onLoad={this.props.refresh}
                        onChange={() => {return true}}
                    >
                        <ProgressCircular indeterminate />
                            Pull to refresh
                    </PullHook>,<div className="content">
                    <Intro title={this.props.title} intro={this.props.intro}/>
                    <OverviewGrid entries={this.props.entries} baseurl={this.props.baseurl}
                                  navigation={this.props.navigation}/></div>
                );
            }
        } else if (this.props.view.page == "swiper") {
            return this.pageWrapper(<div className="content">
                <Swiper entries={this.props.entries}
                        baseurl={this.props.baseurl}
                        navigation={this.props.navigation}
                        index={this.props.view.index}
                        language={this.props.language}/>
            </div>);

        } else if (this.props.view.page == "detail" && this.props.view.index !== undefined && this.props.view.index <= this.props.entries.length) {
            return this.pageWrapper(
                <div className="content"><Detail entry={this.props.entries[this.props.view.index]} baseurl={this.props.baseurl}  language={this.props.language}/></div>
            );
        } else if (this.props.view.page == "about") {
            return this.pageWrapper(
                <div className="content"><About language={this.props.language}/></div>
            );
        } else if (this.props.view.page == "contact") {
            return this.pageWrapper(
                <div className="content"><Contact /></div>
            );
        }

        return this.pageWrapper(
            <div className="content"><Intro title={"ERROR"}
                                                     intro={this.props.status.msg === undefined ? "Undefined error" : this.props.status.msg}/></div>
        );

    }
}