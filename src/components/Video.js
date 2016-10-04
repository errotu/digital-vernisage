import React from "react";
import ons from "onsenui";

export default class Video extends React.Component {

    render() {
        let sources = null;
        this.props.sources.map((source) => {
            let tag;
            //See https://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/
            if(ons.platform.isAndroid() && source.type == "video/mp4") {
                tag = (<source src={this.props.baseurl + "/" + source.source} />);
            } else {
                tag = (<source src={this.props.baseurl + "/" + source.source} type={source.type}/>);
            }
            if (sources == null) {
                sources = tag;
            } else {
                sources = sources + " " + tag;
            }
        });
        
        console.log("Added Video");

        return (
            <video controls poster={this.props.poster}>{sources}Your browser does not support the video tag.</video> );
    }
}