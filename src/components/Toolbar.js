import React from "react";
import {Toolbar as OnsToolbar, BackButton, Icon} from "react-onsenui";
import ons from "onsenui";
var logo = require('../static/logo_square.png');


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
            <div className="center">WeeDooCare {ons.platform.isIOS() ?
                <img src={logo} style={{verticalAlign: 'middle', height: '50%'}}/> : null} Vernissage
            </div>
            <div className="right">{infoButton}</div>
        </OnsToolbar>);
    }

    handleClick() {
        this.props.navigation.pushPage("contact");
    }
}