import React from "react";
import {Col, Row} from "react-onsenui";
import ons from "onsenui";
import ImgCache from "imgcache.js";
var logo = require('../static/logo.png');

export default class Contact extends React.Component {

    render() {
        return (<Row className="contact-page">
            <Col width="100%">Gemma Durany
                <br />Geschäftsführerin | President
                    <br /><a href="mailto:Gemma.Durany@WeeDooCare.com">Gemma.Durany@WeeDooCare.com</a>
            </Col>
            <Col width="100%">
                <img src={logo} title="WeeDooCare-Logo" alt="WeeDooCare-Logo"/>
            </Col>
            <Col width="100%">
                <p style={{color: '#689D1C'}}>We help companies become
                    <br/>ecologically intelligent and wise</p>
            </Col>
            <Col width="100%">
                WeeDooCare Business Solutions GmbH
                <br/>Im Breitspiel 11 B
                    <br/>D-69126 Heidelberg
                        <br/>Germany</Col>

            <Col width="100%">
                <br/>Phone: <a href="tel:+4962217280559">+49 (0) 6221 728 05 59</a>
                    <br/>Fax: +49 (0) 6221 727 86 70
                        <br/>Mobile: <a href="tel:+4916090386853">+49 (0)160 90 38 68 53</a>
                            <br/>E-Mail: <a href="mailto:info@weedoocare.com">Info@WeeDooCare.com</a>
                                <br/><a href="http://www.weedoocare.com" target="_blank">www.WeeDooCare.com</a>
            </Col>

            <Col width="100%"> <br/>Geschäftsführerin: Gemma Durany
                <br/>Amtsgericht Mannheim HRB 708677
                    <br/>USt-IdNr.: DE815166869
                <br/>
            </Col>

            <Col width="100%">
                <ons-button onClick={() => {
                    ImgCache.clearCache(function () {
                        ons.notification.alert("Cache was cleared successfully", {modifier: ons.platform.isIOS ? null : "material"});
                    }, function () {
                        ons.notification.alert("Could not clear cache", {modifier: ons.platform.isIOS ? null : "material"});
                    });
                }}>Clear Cache
                </ons-button>

            </Col>
    </Row>);
    }
}