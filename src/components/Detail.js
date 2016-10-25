import React from "react";
import Intro from "./Intro";
import AudioPlayer from "./AudioPlayer";
import Video from "./Video";
import SingleImage from "./SingleImage";
import {Row, Col} from "react-onsenui";

export default class StartPageContent extends React.Component {

    render() {
        let entry = this.props.entry;
        return (
            <div className="content">
                <Row>
                    <Col width="100%">
                        <Intro title={entry.title} intro={entry.suggestion}/>
                    </Col>
                    {entry.mp3 !== undefined ?
                        <Col width="100%"><b>Audio</b><br /><AudioPlayer
                            src={this.props.baseurl + "/" + entry.mp3}/></Col> : ""}
                    {entry.video !== undefined ?
                        <Col width="100%"><b>Video</b><br /><Video sources={entry.video}
                                                                   baseurl={this.props.baseurl}
                                                                   poster={this.props.baseurl + "/" + entry.source}/></Col> : ""}

                    <Col width="100%"><SingleImage alt={entry.title}
                                                   src={this.props.baseurl + "/" + entry.source}/></Col>
                </Row>
            </div>
        );
    }
}