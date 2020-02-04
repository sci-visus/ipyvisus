import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import { array_serialization } from 'jupyter-dataserializers';
import  * as THREE from 'three';

import { EXTENSION_SPEC_VERSION } from './version';
import './viewer.css'

const MODULE_NAME = '@visus/ipyviewer';

export
class Viewer3dModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: "Viewer3dModel",
      _model_module: MODULE_NAME,
      _model_module_version: EXTENSION_SPEC_VERSION,
      _view_name: "Viewer3dView",
      _view_module: MODULE_NAME,
      _view_module_version: EXTENSION_SPEC_VERSION,

      image: new Float64Array([]),
    }
  }
}

Viewer3dModel.serializers = {
  ...DOMWidgetModel.serializers,
  image: array_serialization,
};


export
class Viewer3dView extends DOMWidgetView {

  render() {
    this.panel = Panel(this, this.el);
  }

  processPhosphorMessage(msg) {
    console.log('Viewer Phosphor message:', msg);
    switch (msg.type) {
      case 'after-attach':
        // d3.select(this.el.parentNode).classed('rg_output', true);
        break;
       case 'after-detach':
        break;
      case 'resize':
        this.panel.resize();
        break;
    }
  }
}


function Panel(view, el) {
  let root = el;
  let model = view.model;

  let width = 600;
  let height = 400;
  let camera = null;
  let scene = null;
  let canvas = null;
  let context = null;
  let renderer = null;
  let cube = null;

  root.classList.add('visus-viewer');
  createViewer();
  fake_scene();
  animate();

  model.on('change:image', image_changed);


  image_changed();

  function image_changed() {
    console.log('image changed');
  }

  function createViewer() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // canvas = document.createElement( 'canvas' );
    // context = canvas.getContext( 'webgl2', { alpha: false } );
    // renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    root.appendChild(renderer.domElement);
  }

  function fake_scene() {
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;
  }

  function animate() {
	  requestAnimationFrame( animate );
	  cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	  renderer.render( scene, camera );
  }

  return {
    resize() {
      console.log('viewer resize');
    }
  }
}