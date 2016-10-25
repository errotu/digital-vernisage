import React from "react";
import {Toolbar as OnsToolbar, BackButton, Icon} from "react-onsenui";
var logo = require('../static/logo.png');


export default class Toolbar extends React.Component {

    render() {
        const backButton = this.props.backButton === true ?
            <BackButton onClick={this.props.navigation.popPage}>Back</BackButton>
            : null;
        const infoButton = this.props.view.page == "contact" ?
            null
            : <Icon icon="fa-info" onClick={this.handleClick.bind(this)}/>;
        return (<OnsToolbar>
            <div className='left'>{backButton}</div>
            <div className="center"><img src={logo} style={{verticalAlign: 'middle', height: '80%'}}/> Vernissage</div>
            <div className="right">{infoButton}</div>
        </OnsToolbar>);
    }

    handleClick() {
        this.props.navigation.pushPage("contact");
    }
}