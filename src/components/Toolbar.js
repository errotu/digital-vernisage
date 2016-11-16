import React from "react";
import {Toolbar as OnsToolbar, BackButton, Icon, ToolbarButton} from "react-onsenui";
import ons from "onsenui";
var logo = require('../static/logo_square.png');


export default class Toolbar extends React.Component {

    render() {
        const toolbarLeftBtn = this.props.backButton === true ?
            <BackButton onClick={this.props.navigation.popPage}>Back</BackButton>
            : <ToolbarButton onClick={this.props.navigation.openMenu}>
                <Icon icon='ion-navicon, material:md-menu' />
            </ToolbarButton>
            ;
        return (<OnsToolbar>
            <div className='left'>{toolbarLeftBtn}</div>
            <div className="center">Digital {!ons.platform.isAndroid() ?
                <img src={logo} style={{verticalAlign: 'middle', height: '50%'}}/> : null} Vernissage
            </div>
        </OnsToolbar>);
    }

    handleClick() {
        this.props.navigation.pushPage("contact");
    }
}