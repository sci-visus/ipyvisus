import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";

import * as ipyvisus from './index';

 import { EXTENSION_SPEC_VERSION } from './version';


function activate(app, registry) {
  registry.registerWidget({
    name: 'ipyvisus',
    version: EXTENSION_SPEC_VERSION,
    exports: ipyvisus
  });
}

const extension = {
  id: 'ipyvisus',
  requires: [IJupyterWidgetRegistry],
  activate: activate,
  autoStart: true
};

export default  extension;

