// Initialize app
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

if(!isAndroid && !isIos) {
    isAndroid = true;
}

Template7.global = {
    android: isAndroid,
    ios: isIos
};

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');

    Dom7('head').append(
        '<link rel="stylesheet" href="lib/framework7/css/framework7.material.min.css">' +
        '<link rel="stylesheet" href="lib/framework7/css/framework7.material.colors.min.css">'
    );
} else {
    Dom7('head').append(
        '<link rel="stylesheet" href="lib/framework7/css/framework7.ios.min.css">' +
        '<link rel="stylesheet" href="lib/framework7/css/framework7.ios.colors.min.css">'
    );
}

/**
 * App logic
 */
var app = {
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        $$("#init-scan").on("click", app.initScan); //Open QR Scanner

        /* Listen for ajax errors */
        $$(document).on('ajaxError', function (e) {
            console.log("Got error");
            console.log(JSON.stringify(e));
        });
    },

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.loadGalleryInfo();
    },

    receivedEvent: function (id) {
        /* Manage (In)Visible Elements for certain events */
        var parentElement = document.getElementById(id);
        if (parentElement != null) {
            $$("#" + id + " .listening").attr("style", "display: none;");
            $$("#" + id + " .received").attr("style", "display: block;");
        }

        /* Manage special cases */
        if(id == "loadEntries") {
            console.log(app.images);
            app.loadGallery("#gallery");
        }
    },

    images: [],
    baseUrl: null,

    //Download & Evaluation of JSON Information
    loadGalleryInfo: function () {
        console.log("Loading gallery information");
        $$.getJSON('https://weedocare.eknoes.de/blog.php?callback=?', function (blog) {
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
                app.receivedEvent("loadEntries");
            });
    },

    //Initializing scan of QR Code
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

    //Open View and show Image information
    showInfo: function (id) {
        mainView.router.load({
            url: 'showInfo.html',
            context: {
                title: app.images[id].title,
                text: app.images[id].suggestion
            }
        });
    },

    loadGallery: function (container) {
        console.log("Loading Gallery Images: " + app.images.length);
        var template = '<img src="{{src}}" alt="{{title}}" class="col-100 tablet-50"/>';

        for (var key in app.images) {
            var value = app.images[key];
            $$(container).append(Template7.compile(template)({
                src: app.baseUrl + "/" + value.source,
                title: value.title
            }));
        }

    }
};

var vernisageApp = new Framework7({
    modalTitle: 'Digital Vernisage',
    material: isAndroid,    // Enable Template7 pages
    template7Pages: true,
    pushState: true
});

// Add view
var mainView = vernisageApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Now we need to run the code that will be executed only for About page.
vernisageApp.onPageInit('about', function (page) {
    // Do something here for "about" page
});


app.initialize();