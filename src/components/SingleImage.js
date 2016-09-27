import React from 'react';

export default class SingleImage extends React.Component {

    render() {
        return (<img src={this.props.src} onClick={this.props.onClick} alt={this.props.alt}/>);
    }
}