'use strict';

// Famous dependencies
import {DOMElement} from 'famous/dom-renderables';
import {FamousEngine} from 'famous/core';
import {Camera} from 'famous/components';

// Local dependencies
import {Discover} from './discover';

// Boilerplate code to make your life easier
FamousEngine.init();

let scene = FamousEngine.createScene('body');
let cameraNode = scene.addChild()
  .setAlign(0, 0, -1);
let camera = new Camera(cameraNode);

camera.setDepth(1500);
cameraNode.setAlign(0, 0, -1);

// fetch('http://localhost:4200/dribbble')
//   .then((res) => res.json())
//   .then((res) => {
//     console.log(res)
//   })

// FamousEngine.getClock().setInterval(() => {
//   let time = Date.now();
//
//   cameraNode.setAlign(Math.sin(time * 0.001) * .5, 0, 0);
//     // spheres[i].dom.setRotation(Math.cos(time * i * 0.001) * 2.0, Math.sin(time * 0.001) * 2.0, 0);
// }, 1000 / 60);
new Discover(scene.addChild());
// new Carousel(scene.addChild());
