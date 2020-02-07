import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import { array_serialization } from 'jupyter-dataserializers';

import { EXTENSION_SPEC_VERSION } from './version';
import './viewer.css'
import { fetchInfo } from "./utils";

const MODULE_NAME = 'ipyvisus';

export
class Viewer2dModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: "ViewerModel",
      _model_module: MODULE_NAME,
      _model_module_version: EXTENSION_SPEC_VERSION,
      _view_name: "ViewerView",
      _view_module: MODULE_NAME,
      _view_module_version: EXTENSION_SPEC_VERSION,

      server: "atlantis.sci.utah.edu",
      proxy: null,
      dataset: null,
      tile_size: 512,
      format: '',
      field: '',
      time: 0,
      palette: null,
      times: [],
      fields: []
    }
  }
}

Viewer2dModel.serializers = {
  ...DOMWidgetModel.serializers,
  // image: array_serialization,
};


export
class Viewer2dView extends DOMWidgetView {

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

import OpenSeaDragon from 'openseadragon';

function Panel(view, el) {
  let root = el;
  let model = view.model;
  let viewer = null;
  let dataset_info = {};

  root.classList.add('visus-viewer');
  viewer = createViewer();

  model.on('change:dataset', dataset_changed);

  model.on('change:server', update_sources);
  model.on('change:proxy', update_sources);
  model.on('change:tile_size', update_sources);
  model.on('change:format', update_sources);
  model.on('change:time', update_sources);
  model.on('change:field', update_sources);
  model.on('change:palette', update_sources);

  dataset_changed();

  async function dataset_changed() {
    let dataset = model.get('dataset');
    if (dataset && dataset !== '') {
      dataset_info = await fetchInfo(model.get('server'), dataset);
      console.log('dataset_info', dataset_info);
      model.set('fields', dataset_info.fields);
      model.set('times', dataset_info.times);
      model.set('time', dataset_info.times.length > 0 ? dataset_info.times[0] : 0);
      view.touch();
      update_sources();
    } else {
      dataset_info = null;
      model.set('fields', []);
      model.set('times', []);
      model.set('time', -1);
    }
  }

  function update_sources() {
    if (!dataset_info) return;

    let dataset = model.get('dataset');
    if (dataset && dataset !== '') {
      let server = model.get('server');
      // let url = new URL(server);
      // let protocol = url.protocol;
      // url.protocol = '';

      let proxy = model.get('proxy');
      if (proxy) {
        server = `${proxy}/proxy?server=${server}`
      } else {
        server = `${server}/mod_visus?`
      }
      viewer.open(createTileSource(server, dataset,
        dataset_info.dims.x, dataset_info.dims.y, dataset_info.nbits,
        model.get("tile_size"),
        model.get('format'),
        model.get('field'),
        model.get('time'),
        model.get('palette')));
    }
  }

  function createViewer() {
    let imagesUrl="https://raw.githubusercontent.com/openseadragon/openseadragon/master/images/";

    return OpenSeaDragon({
      element: root,
      prefixUrl: imagesUrl,
      showNavigator: model.get('show_navigator'),
      debugMode: false,
    });
  }

  function createTileSource(server, dataset, w, h, max_levels, tile_size, format, field, time, palette) {
    let num_levels = parseInt(max_levels / 2, 10);
    return {
        height: h,
        width: w,
        getTileWidth: () => tile_size,
        getTileHeight: () => tile_size,
        minLevel: 0,
        maxLevel: num_levels,

        getTileUrl: function (level, x, y) {
            let scale = Math.pow(2, num_levels - level);
            let size = tile_size * scale;
            let [x1, x2] = [size * x,  Math.min(size * (x + 1) - 1, w)];
            let [y1, y2] = [h - Math.min(size * (y + 1) - 1, h), h - size * y];

            if (!server.startsWith('http'))
              server = `http://${server}`;

            let url = `${server}`
            + `&action=boxquery`
            + `&compression=${format}`
            + `&box=${x1}%20${x2}%20${y1}%20${y2}`
            + `&dataset=${encodeURIComponent(dataset)}`
            + `&maxh=${max_levels}`
            + `&toh=${level * 2}`;

            if (field && field !== '')
              url += `&field=${field}`;

            if (time >= 0)
              url += `&time=${time}`;

            if (palette && palette.length === 4) {
              url += `&palette=${palette[0]}&palette_min=${palette[1]}&palette_max=${palette[2]}&palette_interp=${palette[3]}`
            }

            console.log('url=', url);
            return url;
        }
    };
  }

  return {
    resize() {
      console.log('viewer resize');
    }
  }
}