import React from "react";
import Intro from "./Intro";
import AudioPlayer from "./AudioPlayer";
import Video from "./Video";
import SingleImage from "./SingleImage";
import {Row, Col} from "react-onsenui";

export default class StartPageContent extends React.Component {

    render() {
        let infoText = {
            'de': 'Tippen sie auf das Bild, um es in der Vollbildansicht zu öffnen',
            'en': 'Tap the image to open fullscreen'
        };
        let entry = this.props.entry;
        return (
            <div className="content">
                <Row>
                    <Col width="100%">
                        <Intro title={entry.title} intro={entry.text}/>
                    </Col>
                    {entry.mp3 !== undefined ?
                        <Col width="100%"><b>Audio</b><br /><AudioPlayer
                            src={this.props.baseurl + "/" + entry.mp3}/></Col> : ""}
                    {entry.video !== undefined ?
                        <Col width="100%">
                        <b>Video</b><br />
                            <Video sources={entry.video}
                               baseurl={this.props.baseurl}
                               poster={this.props.baseurl + "/" + entry.source}/>
                        </Col>
                        :
                        <Col width="100%">
                            <SingleImage alt={entry.title}
                                src={this.props.baseurl + "/" + entry.source}
                                clickable={true}/>
                        </Col> }
                </Row>
                <Row>
                    <Col witdh="100%" style={{textAlign: "center"}}><p><i>{infoText[this.props.language.inUse]}
                    </i></p></Col>
                </Row>
            </div>
        );
    }

}