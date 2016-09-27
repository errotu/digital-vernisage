import React from 'react';

export default class Video extends React.Component {

    render() {
        return (<img src={this.props.src} onClick={this.props.onClick}/>);
    }
}