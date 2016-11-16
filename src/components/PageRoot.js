import React from "react";
import {Page} from "react-onsenui";
import Toolbar from "./Toolbar";
import PageContent from "./PageContent";
import QRButton from "./QRButton";

export default class PageRoot extends React.Component {

    render() {
        return (<Page key={this.props.view.page + this.props.view.index}
                      renderToolbar={() => <Toolbar view={this.props.view} navigation={this.props.navigation}
                                                    backButton={this.props.view.index !== undefined}/>}
                      renderFixed={() => (this.props.status.state != "error" && this.props.status.state != "fetching") ?
                          <QRButton
                              navigation={this.props.navigation}/> : null}>
            <PageContent status={this.props.status} view={this.props.view} title={this.props.title}
                         intro={this.props.intro} entries={this.props.entries} baseurl={this.props.baseurl}
                         navigation={this.props.navigation}
                         loadCallback={this.props.loadCallback}
            />
        </Page>);
    }
}