/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        console.log("Device Ready");
        app.loadGalleryInfo();
    },

    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        if (parentElement != null) {
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }
        console.log('Received Event: ' + id);
    },

    images: [],
    baseUrl: null,

    /*
        Download & Evaluation of JSON Information
     */
    loadGalleryInfo: function () {
        console.log("Loading gallery information");
        $.getJSON('http://weedocare.eknoes.de/blog.php?callback=?')
            .done(function (blog) {
                var i,
                    current,
                    imgId;
                console.log("Got " + blog.blogentries.length + " entries");
                for (i = 0; i < blog.blogentries.length; i = i + 1) {
                    current = blog.blogentries[i];
                    imgId = current.url.split("#")[1];
                    app.images[imgId] = current;
                    console.log("Got img:" + imgId);
                }
                app.baseUrl = blog.baseUrl;
            })
            .fail(function (error) {
                console.log("Got error");
                console.log(error);
            });
    },

    /*
    Initializing scan of QR Code
     */
    initScan: function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log(result);
                console.log(app.images[result.text]);
                app.showInfo(result.text.split("#")[1])
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                "preferFrontCamera": false, // iOS and Android
                "showFlipCameraButton": true, // iOS and Android
                "prompt": "Place a barcode inside the scan area", // supported on Android only
                "formats": "QR_CODE,PDF_417" // default: all but PDF_417 and RSS_EXPANDED
            }
        );
    },

    /*
    Show Information of QR Code
     */
    showInfo: function (id) {
        console.log("Show Object " + id);
        var currentObj = app.images[id];
        $("#imgTitle").html(currentObj.title);
        $("#image").attr("src", app.baseUrl + "/" + currentObj.source);
    }
};

window.onload = function () {
    app.initialize();
};