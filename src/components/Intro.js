import React from 'react';

import {
    Toolbar as OnsToolbar,
} from 'react-onsenui'

export default class Intro extends React.Component {

    render() {
        return (<div><h2 className="headline">{this.props.title}</h2><p>{this.props.intro}</p></div>);
    }
}