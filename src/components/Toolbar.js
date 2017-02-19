import React from "react";
import {Toolbar as OnsToolbar, BackButton, Icon, ToolbarButton} from "react-onsenui";
import ons from "onsenui";
const logo = require('../static/logo_square.png');


export default class Toolbar extends React.Component {

    render() {
        const toolbarLeftBtn = this.props.backButton === true ?
                <BackButton onClick={this.props.navigation.popPage}>Back</BackButton>
                : <ToolbarButton onClick={this.props.navigation.openMenu}>
                    <Icon icon='ion-navicon, material:md-menu' />
                </ToolbarButton>
            ;
        const toolbarRightBtn = this.props.refresh !== null ? <ToolbarButton onClick={this.props.refresh}>
                                    <Icon icon='ion-ios-refresh-empty, material:ion-android-refresh' />
                                </ToolbarButton> : null;
            ;
        return (<OnsToolbar>
            <div className='left'>{toolbarLeftBtn}</div>
            <div className="center">Digital {!ons.platform.isAndroid() ?
                <img src={logo} style={{verticalAlign: 'middle', height: '50%'}}/> : null} Vernissage
            </div>
            <div className="right">{toolbarRightBtn}</div>
        </OnsToolbar>);
    }

    handleClick() {
        this.props.navigation.pushPage("contact");
    }
}