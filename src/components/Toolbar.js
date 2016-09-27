import React from 'react';

import {
    Toolbar as OnsToolbar,
    BackButton,
    Icon
} from 'react-onsenui'

export default class Toolbar extends React.Component {

    render() {
        const backButton = this.props.backButton === true
            ? <BackButton onClick={this.props.navigation.popPage}>Back</BackButton>
            : null;
        return (<OnsToolbar>
            <div className='left'>{backButton}</div>
            <div className="center">Digital Vernisage</div>
            <div className="right"><Icon icon="fa-envelope" onClick={this.handleClick.bind(this)} /></div>
        </OnsToolbar>);
    }

    handleClick() {
        this.props.navigation.pushPage("contact");
    }
}