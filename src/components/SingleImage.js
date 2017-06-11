import React from "react";
import ImgCache from "imgcache.js";
import * as PhotoViewer from "../../plugins/com-sarriaroman-photoviewer/www/PhotoViewer";

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
            this.state.onClick = () => {
                console.log("Open Image!");
                function error(code) {
                    if (code === 1) {
                        alert('No file handler found');
                    } else {
                        //alert('Undefined error: ' + code);
                    }
                }

                function success() {
                    console.log("Success opening image!");
                }

                PhotoViewer.show(props.src, props.alt);};
        }
    }

    render() {
        let img = (<img src={this.state.src} onClick={this.state.onClick} alt={this.state.alt} />);
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
                    })
                } else {
                    console.log("Is not cached");
                    ImgCache.cacheFile(path,
                        () => {
                            console.log("Success!");
                            this.forceUpdate();
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