#!/usr/bin/env bash
phonegap platform remove ios
phonegap platform remove browser
phonegap platform remove android
phonegap platform remove windows


phonegap platform add ios
phonegap platform add browser
phonegap platform add android
phonegap platform add windows

phonegap plugin add phonegap-plugin-barcodescanner
cordova plugin add cordova-plugin-nativeaudio