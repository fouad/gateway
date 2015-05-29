import {FamousEngine} from 'famous/core';
import Sphere from 'famous/webgl-geometries/primitives/Sphere';
import {Align, Size, GestureHandler} from 'famous/components';
import DOMElement from 'famous/dom-renderables/DOMElement';
import Material from 'famous/webgl-materials/Material';
import {Mesh} from 'famous/webgl-renderables';
import {Color} from 'famous/utilities';

import {Carousel} from '../carousel';

export class Discover {
  constructor(node) {
    this.dispatch = node;
    this.el = new DOMElement(node);
    this.dispatch.setSizeMode(1, 1, 1);
    this._id = node.addComponent(this);

    this.dispatch
      .setMountPoint(0.5, 0.5, 0.5)
      .setAlign(0.5, 0.5, 0.5)
      .setSizeMode(1, 1, 1)
      .setAbsoluteSize(800, 800, 800);

    // this.el.setAbsoluteSize()

    // var sp = node.createChild();
    // sp.setSize(30, 30, 30)
    //   .set

    let spheres = this.spheres = [];
    spheres.push(new DSphere(this, 0));
    spheres.push(new DSphere(this, 1));
    spheres.push(new DSphere(this, 2));

    FamousEngine.getClock().setInterval(() => {
      let time = Date.now();

      for (let i = 0; i < spheres.length; i++) {
        if (spheres[i].dragging) {
          continue;
        }
        spheres[i].meshNode.setRotation(Math.cos(time * i * 0.001) * 2.0, Math.sin(time * 0.001) * 2.0, 0);
        // spheres[i].dom.setRotation(Math.cos(time * i * 0.001) * 2.0, Math.sin(time * 0.001) * 2.0, 0);
      };
    }, 1000 / 60);

    this.dispatch.requestUpdate(this._id);
  }

  onReceive(type, ev) {
    if (type === 'expand') {
      this.displayClose();
    }
  }

  minimizeOthers(idx) {
    this.spheres.map((sp, id) => {
      if (id !== idx) {
        sp.minimize();
      }
    });
  }
}

export class DSphere {
  constructor(parent, idx) {
    this.parent = parent;
    this._idx = idx;

    let node = this.dispatch = parent.dispatch;
    let material = Material.normal();

    let domNode = this.domNode = node.addChild()
      .setMountPoint(0.5, 0.5, 1)
      // .setAlign(0.5 * idx, 0.5 , 0.5)
      // .setProportionalSize(.2, .2, .2)
      .setOrigin(0.5, 0.5, 0.5);
    let domAlign = this.domAlign = new Align(domNode);
    let domEl = this.domEl = new DOMElement(domNode, {
      properties: {
        cursor: 'pointer',
        borderRadius: '400px',
        opacity: 0,
      },
    });
    /*
      Create meshNode
    */
    let meshNode = this.meshNode = node.addChild()
      .setMountPoint(0.5, 0.5, 0.5)
      // .setAlign(0.5 * idx, 0.5 , 0.5)
      // .setProportionalSize(.2, .2, .2)
      .setOrigin(0.5, 0.5, 0.5);
    let meshAlign = this.meshAlign = new Align(meshNode);

    let initialAlign = [0.5 * idx, 0.5, 0.5];
    meshAlign.set(...initialAlign);
    domAlign.set(...initialAlign);

    let dsz = this.domSize = new Size(domNode);
    let sz = this.meshSize = new Size(meshNode);
    // sz.setMode('proportional', 'proportional', 'proportional')
    sz.setProportional(.2, .2, .2);
    dsz.setProportional(.2, .2, .2);

    let mesh = this.mesh = new Mesh(meshNode)
      .setGeometry('GeodesicSphere')
      .setBaseColor(material)
      .setGlossiness(new Color('red'), 40);

    /*
      Handle gestures
    */
    let gestures = new GestureHandler(domNode);

    gestures.on('tap', (ev) => {
      console.log(ev);
      if (ev.status === 'start') {
        let dg  = !this.dragging;

        if (dg) {
          this.expand(dg);
        } else {
          sz.setProportional(.2, .2, .2, {curve: 'easeOut', duration: 400});
          dsz.setProportional(.2, .2, .2, {duration: 400});
          meshAlign.setX(.5 * idx, {duration: 300});
          domAlign.setX(.5 * idx, {duration: 300});
          setTimeout(() => {
            meshNode.dragging = dg;
          }, 200);
        }
      }
    });
  }

  expand() {
    this.meshSize.setProportional(4, 4, 4, {curve: 'easeOutBounce', duration: 400});
    this.domSize.setProportional(4, 4, 4, {duration: 400});
    this.meshNode.dragging = true;
    this.meshAlign.setX(.5, {duration: 300});
    this.domAlign.setX(.5, {duration: 300});
    this.domAlign.setZ(-.5);

    this.parent.minimizeOthers(this._idx);

    var slider = new Carousel(this.dispatch);
    this.domNode.emit('jake', true);

    // slider.on('', () => {

    // });
  }

  reset() {
    this.meshSize.setProportional(.2, .2, .2, {curve: 'easeOut', duration: 400});
    this.domSize.setProportional(.2, .2, .2, {duration: 400});
    this.meshAlign.setX(.5 * this._idx, {duration: 300});
    this.domAlign.setX(.5 * this._idx, {duration: 300});
    setTimeout(() => {
      meshNode.dragging = dg;
    }, 200);
  }

  minimize() {
    this.meshSize.setProportional(0,0,0, {curve: 'easeOut', duration: 400});
    this.domSize.setProportional(0,0,0, {duration: 400});
  }
}
