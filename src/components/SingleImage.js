import React from "react";
import ImgCache from "imgcache.js";
//import PhotoViewer from "com-sarriaroman-photoviewer";
//import * as PhotoViewer from "../../plugins/com-sarriaroman-photoviewer/www/PhotoViewer";
import ons from "onsenui";

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
                function error(code) {
                    if (code === 1) {
                        alert('No file handler found');
                    } else {
                        alert('Undefined error: ' + code);
                    }
                }

                function success() {
                    console.log("Success opening image!");
                }
//                if(ons.platform.isAndroid()) {
                    console.log("Open in PhotoViewer");
                    PhotoViewer.show(this.state.src, props.alt);
/*                } else {
                    console.log("Open " + this.state.src);
                    cordova.plugins.disusered.open(this.state.src, success, error);
                }
*/            };
        }
    }

    render() {
        let img = (<img src={this.state.src} onClick={this.state.onClick} alt={this.state.alt} />);
        if (ImgCache.ready && !this.state.cached) {
            let callback = (path, success) => {
                if (success) {
                    ImgCache.getCachedFileURL(path, (src, cached) => {
			resolveLocalFileSystemURL(cached, (entry) => {
                        	
				this.setState({
                            		cached: true,
                            		src: entry.toURL(),
                        	});
			});
                    })
                } else {
                    ImgCache.cacheFile(path,
                        () => {
                            console.log("Success on caching file: " + this.state.src);
                            this.forceUpdate();
                        },
                        () => {
                            console.log("Could not cache file: " + this.state.src);
                        });
                }
            };
            ImgCache.isCached(this.state.src, callback);
        } else {
		console.log("File is cached: " + this.state.src);
	}
        return (img);
    }
}
