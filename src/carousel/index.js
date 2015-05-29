import imageData from './dribbble.json';
import FamousEngine from 'famous/core/FamousEngine';
import DOMElement from 'famous/dom-renderables/DOMElement';
import PhysicsEngine from 'famous/physics/PhysicsEngine';
import {GestureHandler, Position} from 'famous/components';

import {Spring, Box, RotationalSpring, RotationalDrag} from 'famous/physics';
import {Quaternion, Vec3} from 'famous/math';

function clamp(min, n, max) {
  return Math.min(max, Math.max(min, n));
}

export class Carousel {
  constructor(root) {
    this.root = root.addChild();

    this.ANIMATE_DELTA = 0.01;

    this.images = imageData.map((url, index) => {
      let image = new Image(this.root.addChild(), url);

      image.root.setAlign(0.5 * (1 + index), 0.5, 0);
      this.currentIndex = 0;

      // image.gestureHandler.on('tap', () => {
      //   this.setCurrentImage(index);
      // });

      return image;
    });

    this.gestureHandler = new GestureHandler(this.root);
    this.gestureHandler.on('drag', (ev) => {
      let [x,y,z] = this.root.getPosition();
      x += ev.centerDelta.x;
      this.root.setPosition(x, y, z);
      console.log(x);

      if (ev.status == 'start') {
        this.startX = ev.center.x;
      } else if (ev.status == 'end') {

        let pos = new Position(this.root);
        let totalDistance = ev.center.x - this.startX;
        let change = totalDistance > 0 ? -1 : 1;
        let totalWidth = window.innerWidth/2;
        let percentDistance = Math.abs(totalDistance / totalWidth);
        let distanceRemaining = Math.abs(percentDistance * totalWidth);
        let transitionDuration = Math.abs(distanceRemaining / (ev.centerVelocity.x/1000));

        console.log(totalDistance, change);

        this.currentIndex = clamp(0, this.currentIndex + change, this.images.length - 1);
        pos.setX(-0.5*window.innerWidth * this.currentIndex, {
          duration: clamp(200, transitionDuration, 750),
          curve: 'easeOut'
        });
      }
    });

    this.root.addUIEvent('wheel');
  }

  scroll(ev) {
    let [x,y,z] = this.root.getPosition();
    x += ev.centerDelta.x;
    this.root.setPosition(x, y, z);
    console.log(x);
    let pos = new Position(this.root);
    let totalDistance = ev.center.x - this.startX;
    let change = totalDistance > 0 ? -1 : 1;
    let totalWidth = window.innerWidth/2;
    let percentDistance = Math.abs(totalDistance / totalWidth);
    let distanceRemaining = Math.abs(percentDistance * totalWidth);
    let transitionDuration = Math.abs(distanceRemaining / (ev.centerVelocity.x/1000));

    console.log(totalDistance, change);

    this.currentIndex = clamp(0, this.currentIndex + change, this.images.length - 1);
    pos.setX(-0.5*window.innerWidth * this.currentIndex, {
      duration: clamp(200, transitionDuration, 750),
      curve: 'easeOut'
    });
  }

  onReceive(type, ev) {
    console.log(type, ev)
    if (type === 'wheel') {
      this.scroll(ev);
    }
  }

  setCurrentImage(index) {
    let align = new Align(this.root);
    align.setX(-0.5*index, {
      duration: 300,
      // curve: 'easeOut'
    });
  }

  animate() {
    FamousEngine.getClock().setInterval(() => {
      let align = this.root.getAlign();
      if (align[0] > this.toAlign) {
        align[0] -= 0.01;
      } else {
        align[0] += 0.01;
      }
      this.root.setAlign(align[0], align[1], align[2]);
    }, 1000/60);
  }

}


export class Image {
  constructor(root, url) {
    this.root = root
      .setSizeMode(1,1,1)
      .setAbsoluteSize(500, 200, 0)
      .setMountPoint(0.5, 0.5, 0.5)
      .setOrigin(0.5, 0.5, 0.5)
      .setAlign(0.5, 0.5, 0.5);

    this.domElement = new DOMElement(this.root)
      .setProperty('backgroundImage', `url(${url})`)
      .setProperty('background-repeat', 'no-repeat')
      // .setProperty('background-size', 'cover');

    this.gestureHandler = new GestureHandler(this.root);

    // let pos = 0;
    // let rotYInterval = Math.PI * 2 / (1000/60) / 3;
    // let rotXInterval = rotYInterval / 10;
    // let rotX = 0;
    // let rotY = 0;
    // FamousEngine.getClock().setInterval(() => {
    //   this.root.setPosition(pos++, 0, 0);
    //   this.root.setRotation(rotX, rotY, 0);
    //   rotX = (rotX + rotXInterval) % (Math.PI * 2);
    //   rotY = (rotY + rotYInterval) % (Math.PI * 2);
    // }, 1000/60);

    // this.box = new Box({
    //   mass: 100,
    //   size: [100,100,100]
    // });

    // this.anchor = new Vec3(0,0,0);
    // this.spring = new Spring(null, this.box, {
    //   period: 0.6,
    //   dampingRatio: 0.5,
    //   anchor: this.anchor
    // });

    // this.quaternion = new Quaternion();
    // this.rotationalSpring = new RotationalSpring(null, this.box, {
    //   period: 1,
    //   dampingRatio: 0.2,
    //   anchor: this.quaternion
    // });

    // this.simulation = new PhysicsEngine();
    // this.simulation.add(this.box, this.spring, this.rotationalSpring);

    // setTimeout(() => {
    //   this.anchor.set(-1, 0, 0);
    //   this.quaternion.fromEuler(0, Math.PI/2, 0);
    //   this.anchor.set(0, 0, 0);
    //   this.quaternion.set(1, 0, 0, 0);
    // });
  }
}
