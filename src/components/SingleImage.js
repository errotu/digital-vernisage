import React from "react";
import ImgCache from "imgcache.js";

export default class SingleImage extends React.Component {

    constructor(props) {
        super();
        this.state = {
            src: props.src,
            onClick: props.onClick,
            alt: props.alt,
            cached: false
        };
        if (props.clickable) {
            this.state.onClick = () => {console.log("click!");
                function error(code) {
                    if (code === 1) {
                        alert('No file handler found');
                    } else {
                        alert('Undefined error');
                    }
                }

                function success() {
                    console.log("Success opening image!");
                }

                cordova.plugins.disusered.open(this.state.src, success, error);};
        }
    }

    render() {
        let img = (<img src={this.state.src} onClick={this.state.onClick} alt={this.state.alt} onLoad={this.forceUpdate}/>);
        if (ImgCache.ready && !this.state.cached) {
            let callback = (path, success) => {
                console.log(path);
                if (success) {
                    console.log("Is cached: " + path);
                    ImgCache.getCachedFileURL(path, (src, cached) => {
                        this.setState({
                            cached: true,
                            src: cached,
                        });
                        this.forceUpdate();
                    })
                } else {
                    console.log("Is not cached");
                    ImgCache.cacheFile(path,
                        () => {
                            console.log("Success!");
                            ImgCache.isCached(path, callback);
                        },
                        () => {
                            console.log("Error");
                        });
                }
            };
            ImgCache.isCached(this.state.src, callback);
        }
        return (img);
    }
}