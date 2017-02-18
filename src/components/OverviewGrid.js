import React from "react";
import SingleImage from "./SingleImage";
import {Row, Col} from "react-onsenui";

export default class OverviewGrid extends React.Component {

    render() {
        return (<Row id="overview" verticalAlign="center">
            {this.props.entries.map((entry, index) => {
                return(<Col verticalAlign="center" width="50%" height="50%" key={"overview-container-" + index}>
                    <SingleImage alt={entry.title} src={this.props.baseurl + "/" + entry.thumb} onClick={this.handleClick.bind(this, index)} key={"overview-" + index}/>
                </Col>);
        })}
        </Row>);
    }

    handleClick(index, event) {
        this.props.navigation.pushPage("detail", index);
    }
}