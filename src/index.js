'use strict';

// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');

// Boilerplate code to make your life easier
FamousEngine.init();

var Discover = require('./discover');
var scene = FamousEngine.createScene();

Discover(scene);

