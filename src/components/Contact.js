import React from "react";
import {Col, Row} from "react-onsenui";
var logo = require('../static/logo.png');

export default class Contact extends React.Component {

    render() {
        return (<Row className="contact-page">
            <Col width="100%">
                <p>WeeDooCare<br/>
                    Im Breitspiel 11B<br/>
                    69126 Heidelberg</p>
                <p>Telefonnummer: +49 (0)6221 728 05 59<br/>
                Email: <a href="mailto:info@weedoocare.com">info@weedoocare.com</a></p>
</Col>
        </Row>);
    }
}