import React from "react";

export default class Video extends React.Component {

    render() {
        let sources = [];
        this.props.sources.map((source) => {
            //See https://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/
            if (source.type == "video/mp4") {
                sources.push(
                    <source src={this.props.baseurl + "/" + source.source} key="android-video"/>
                );
            }
            sources.push(
                <source src={this.props.baseurl + "/" + source.source} type={source.type} key={source.type}/>
            );
        });
        
        console.log("Added Video");

        return (
            <video controls="true" poster={this.props.poster}>{sources}</video> );
    }
}