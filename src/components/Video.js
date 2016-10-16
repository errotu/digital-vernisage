import React from "react";
import ons from "onsenui";

export default class Video extends React.Component {

    render() {
        let sources = [];
        this.props.sources.map((source) => {
            //See https://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/
            if(ons.platform.isAndroid() && source.type == "video/mp4") {
                sources.push(
                    <source src={this.props.baseurl + "/" + source.source}/>
                );
            } else {
                sources.push(
                    <source src={this.props.baseurl + "/" + source.source} type={source.type}/>
                );
            }
        });
        
        console.log("Added Video");

        return (
            <video controls="true" poster={this.props.poster}>{sources}</video> );
    }
}