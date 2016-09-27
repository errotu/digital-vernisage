import React from 'react';
import ons from 'onsenui';
import {
    Fab,Icon
} from 'react-onsenui'
import {ERR_INVALID_QR} from "../index";

export default class QRButton extends React.Component {

    render() {
        return (<Fab style={{backgroundColor: ons.platform.isIOS() ? '#4282cc' : null}} onClick={this.handleClick.bind(this)}
                                    position='bottom right'>
                <Icon icon='fa-qrcode' size={26} fixedWidth={false} style={{verticalAlign: 'middle'}} />
            </Fab>);
    }

    handleClick() {
        cordova.plugins.barcodeScanner.scan(
            (result) => {
                this.props.navigation.pushPage("qr-code", result.text);
            },
            (error) => {
                this.props.navigation.displayError(ERR_INVALID_QR);
            },
            {
                "preferFrontCamera": false, // iOS and Android
                "showFlipCameraButton": true, // iOS and Android
                "prompt": "Place a barcode inside the scan area", // supported on Android only
                "formats": "QR_CODE,PDF_417" // default: all but PDF_417 and RSS_EXPANDED
            }
        );
    }
    /* TODO: Handle Barcode scan */
}