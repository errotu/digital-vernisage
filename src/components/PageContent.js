import React from "react";
import Intro from "./Intro";
import OverviewGrid from "./OverviewGrid";
import Swiper from "./Swiper";
import Detail from "./Detail";
import About from "./About";
import Contact from "./Contact";
import {ProgressCircular, PullHook} from "react-onsenui";

export default class StartPageContent extends React.Component {

    render() {
        if (this.props.view.page == "overview") {
            if (this.props.status.state == "fetching") {
                return (<div className="content centered">
                    <ProgressCircular indeterminate/>
                    <p>Loading data</p>
                </div>);
            } else if (this.props.status.state == "fetched") {
                return (<Page>
                    <PullHook
                        onLoad={this.props.refresh}
                        onChange={() => {return true}}
                    >
                        <ProgressCircular indeterminate />
                        Pull to refresh
                    </PullHook>
                    <Intro title={this.props.title} intro={this.props.intro}/>
                    <OverviewGrid entries={this.props.entries} baseurl={this.props.baseurl}
                                  navigation={this.props.navigation}/>
                </Page>);
            }
        } else if (this.props.view.page == "swiper") {
            return (<div className="content">
                <Swiper entries={this.props.entries}
                        baseurl={this.props.baseurl}
                        navigation={this.props.navigation}
                        index={this.props.view.index}
                        language={this.props.language}/>
            </div>);

        } else if (this.props.view.page == "detail" && this.props.view.index !== undefined && this.props.view.index <= this.props.entries.length) {
            return (
                <Detail entry={this.props.entries[this.props.view.index]} baseurl={this.props.baseurl}  language={this.props.language}/>
            );
        } else if (this.props.view.page == "about") {
            return (
                <div className="content">
                    <About language={this.props.language}/>
                </div>
            );
        } else if (this.props.view.page == "contact") {
            return (
                <div className="content">
                    <Contact />
                </div>
            );
        }

        return (<div className="content">
            <Intro title={"ERROR"}
                   intro={this.props.status.msg === undefined ? "Undefined error" : this.props.status.msg}/>
            <ons-button onClick={this.props.loadCallback}>Reload
            </ons-button>

        </div>);
    }
}