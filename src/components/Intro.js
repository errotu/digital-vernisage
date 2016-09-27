import React from "react";

export default class Intro extends React.Component {

    render() {
        return (<div><h2 id="headline">{this.props.title}</h2><p>{this.props.intro}</p></div>);
    }
}