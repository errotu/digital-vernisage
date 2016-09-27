import React from 'react';
import SingleImage from './SingleImage'


import {
    CarouselItem, Carousel, Button
} from 'react-onsenui'

export default class Swiper extends React.Component {

    constructor(props) {
        super();
        console.log(props);
        this.state = {index: (props.index === undefined ? 0 : props.index)};
    }

    handleChange(e) {
        this.setState({index: e.activeIndex});
    }

    render() {
        return (<div><Carousel id="swiper" index={this.state.index} onPostChange={this.handleChange.bind(this)} fullscreen swipeable autoScroll overscrollable>
            {this.props.entries.map((entry, index) => {
                return(<CarouselItem key={"swiper-" + entry.id}>
                    <div className={"container"}>
                        <SingleImage alt={entry.title} src={this.props.baseurl + "/" + entry.source} key={"overview-" + entry.id} onClick={this.handleClick.bind(this, index)} />
                    </div>
                </CarouselItem>);
            })}
        </Carousel>
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