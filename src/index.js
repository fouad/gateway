'use strict';

import DOMElement from 'famous/dom-renderables/DOMElement';
import FamousEngine from 'famous/core/FamousEngine';

import {Carousel} from './carousel';

// Boilerplate code to make your life easier
FamousEngine.init();

var scene = FamousEngine.createScene();

new Carousel(scene);
