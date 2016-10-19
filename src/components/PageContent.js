import React from "react";
import Intro from "./Intro";
import OverviewGrid from "./OverviewGrid";
import Swiper from "./Swiper";
import Detail from "./Detail";
import Contact from "./Contact";
import {ProgressCircular} from "react-onsenui";

export default class StartPageContent extends React.Component {

    render() {
        if (this.props.view.page == "overview") {
            if (this.props.status.state == "fetching") {
                return (<div className="content centered">
                    <ProgressCircular indeterminate/>
                    <p>Loading data</p>
                </div>);
            } else if (this.props.status.state == "fetched") {
                return (<div className="content">
                    <Intro title={this.props.title} intro={this.props.intro}/>
                    <OverviewGrid entries={this.props.entries} baseurl={this.props.baseurl}
                                  navigation={this.props.navigation}/>
                </div>);
            }
        } else if (this.props.view.page == "swiper") {
            return (<div className="content">
                <Swiper entries={this.props.entries}
                        baseurl={this.props.baseurl}
                        navigation={this.props.navigation}
                        index={this.props.view.index}/>
            </div>);

        } else if (this.props.view.page == "detail" && this.props.view.index !== undefined && this.props.view.index <= this.props.entries.length) {
            let entry = this.props.entries[this.props.view.index];
            if (entry.video !== undefined) {
                console.log("Has Video!");
            }
            return (
                <Detail entry={this.props.entries[this.props.view.index]} baseurl={this.props.baseurl}/>
            );
        } else if (this.props.view.page == "contact") {
            return (
                <div className="content">
                    <Contact />
                </div>
            );
        }

        console.log(this.props);

        return (<div className="content">
            <Intro title={"ERROR"}
                   intro={this.props.status.msg === undefined ? "Undefined error" : this.props.status.msg}/>
        </div>);
    }
}