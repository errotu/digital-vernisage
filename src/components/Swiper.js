import React from 'react';
import SingleImage from './SingleImage'

import ons from 'onsenui';
import {
    CarouselItem, Carousel, Modal, Button
} from 'react-onsenui'

export default class Swiper extends React.Component {

    constructor(props) {
        super();
        this.state = {index: (props.index === undefined ? 0 : props.index)};

        if(typeof(Storage) !== "undefined") {
            let date = new Date();
            let currentDate = date.getDate().toString() + date.getMonth().toString();

            if(localStorage.gotInfoToday == currentDate) {
                this.state.isOpen = false;
            } else {
                //First app use today
                this.state.isOpen = true;
                localStorage.gotInfoToday = currentDate;
            }
        } else {
            this.state.isOpen = false;
        }
    }

    handleChange(e) {
        this.setState({index: e.activeIndex});
    }

    render() {
        let infoText = {
            'de': 'Tippe auf ein Bild, um weitere Informationen zu erhalten',
            'en': 'Tap an image to get more information'
        };
        let infoModal = (<Modal
                isOpen={this.state.isOpen}>
                <section style={{margin: '16px'}}>
                    <p style={{opacity: 0.6}}>
                        {infoText[this.props.language.inUse]}
                    </p>
                    <p>
                        <Button onClick={() => this.setState({isOpen: false})}>
                            Okay
                        </Button>
                    </p>
                </section>
            </Modal>
        );

        return (<div style={{textAlign: "center"}}><Carousel id="swiper" index={this.state.index} onPostChange={this.handleChange.bind(this)} fullscreen swipeable autoScroll overscrollable>
            {this.props.entries.map((entry, index) => {
                return(<CarouselItem key={"swiper-" + entry.id}>
                    <div className={"container"}>
                        <SingleImage alt={entry.title} src={this.props.baseurl + entry.source} key={"overview-" + entry.id} onClick={this.handleClick.bind(this, index)} />
                    </div>
                </CarouselItem>);
            })}
        </Carousel>
            {infoModal}
            <div style={{
            textAlign: 'center',
                fontSize: '20px',
                position: 'absolute',
                bottom: '36px',
                left: '0px',
                right: '0px'
        }}>
        {this.props.entries.map((item, index) => (
            <span key={index} style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, index)}>
              {this.state.index === index ? '\u25CF' : '\u25CB'}
            </span>
        ))}
    </div></div>);
    }

    setIndex(index) {
        this.setState({index: index});
    }

    handleClick(index, event) {
        this.props.navigation.pushPage("detail", index);
    }
}