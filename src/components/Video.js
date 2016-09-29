import React from "react";

export default class Video extends React.Component {

    render() {
        let sources;
        this.props.sources.map((source) => {
            let tag = (<source src={this.props.baseurl + "/" + source.source} type={source.type}/>);
            if (sources == null) {
                sources = tag;
            } else {
                sources = sources + tag;
            }
        });

        return (
            <video controls poster={this.props.poster}>{sources}Your browser does not support the video tag.</video> );
    }
}