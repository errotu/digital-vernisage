import React from "react";
import {Toolbar as OnsToolbar, BackButton, Icon} from "react-onsenui";

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
            <div className="center">Digital Vernisage</div>
            <div className="right">{infoButton}</div>
        </OnsToolbar>);
    }

    handleClick() {
        this.props.navigation.pushPage("contact");
    }
}