import React from "react";
import Intro from "./Intro";
import OverviewGrid from "./OverviewGrid";
import Swiper from "./Swiper";
import AudioPlayer from "./AudioPlayer";
import Video from "./Video";
import SingleImage from "./SingleImage";
import Contact from "./Contact";
import {ProgressCircular, Row, Col} from "react-onsenui";

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
            return (
                <div className="content">
                    <Row>
                        <Col width="100%">
                            <Intro title={entry.title} intro={entry.suggestion}/>
                        </Col>
                        {entry.mp3 !== undefined ?
                            <Col width="100%"><AudioPlayer src={this.props.baseurl + "/" + entry.mp3}/></Col> : ""}
                        {entry.video !== undefined ?
                            <Col width="100%"><Video src={this.props.baseurl + "/" + entry.video}/></Col> : ""}

                        <Col width="100%"><SingleImage alt={entry.title} src={this.props.baseurl + "/" + entry.source}/></Col>
                    </Row>
                </div>
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