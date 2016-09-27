import React from 'react';

export default class AudioPlayer extends React.Component {

    render() {
        return (<audio src={this.props.src} controls />);
    }
}