import React from "react";
import {Col, Row, ListItem, Input, List, ListHeader} from "react-onsenui";
let logo = require('../static/logo.png');

export default class About extends React.Component {

    render() {
        let version = __VERSION__;
        return (<Row className="about-page">
            <Col width="100%">
                <img src={logo} title="WeeDooCare-Logo" alt="WeeDooCare-Logo"/>
            </Col>
            <Col width="100%">
                <p>We see the world as an ecosystem, and combine facts with poetry and art.</p>
                <p>With this Digital Vernissage we want to show our GreenArt. Unique green cartoons and art galleries to
                    guide people for a mindset change.</p>

                <p>See more on <a href="http://www.weedoocare.com">www.weedoocare.com</a></p></Col>
            <Col width="100%">
                <p>App-Version: {version}</p>
            </Col>
	         <Col width="100%">            
	            <b>Privacy Statement</b>
					<p>While using this application no user-related, anonymized or similar data are collected or forwarded.</p>
					<p>The permission for the use of the camera are exclusively used to enable the internal qr-scanner of the application.</p>
					<b>Provider data:</b>
					<p>WeeDooCare Business Solutions GmbH</p>
					<p>Im Breispiel 11B<br />
					69126 Heidelberg<br />
					Germany</p>
					<p><a href="mailto:apps@weedoocare.com">apps@weedoocare.com</a></p>
	         </Col>				
        </Row>);
    }

}
