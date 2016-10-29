import React from "react";
import {Col, Row} from "react-onsenui";
var logo = require('../static/logo.png');

export default class Contact extends React.Component {

    render() {
        return (<div className="contact-page">
            <div width="100%">
                <img src={logo} title="WeeDooCare-Logo" alt="WeeDooCare-Logo"/>
            </div>
                <p>We see the world as an ecosystem, and combine facts with poetry and art.</p>
                <p>With this Digital Vernissage we want to show our GreenArt. Unique green cartoons and art galleries to
                    guide people for a mindset change.</p>

                <p>See more on <a href="https://www.weedoocare.com">www.weedoocare.com</a></p>
        </div>);
    }
}