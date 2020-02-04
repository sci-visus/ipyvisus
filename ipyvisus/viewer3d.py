import numpy as np

from ipywidgets import DOMWidget, register
from traitlets import Bool, Int, Unicode
from ipydatawidgets import NDArray, array_serialization

from .__version__ import EXTENSION_SPEC_VERSION
MODULE_NAME = 'ipyvisus'


@register
class Viewer3d(DOMWidget):
    _model_name = Unicode('Viewer3dModel').tag(sync=True)
    _model_module = Unicode(MODULE_NAME).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    _view_name = Unicode('Viewer3dView').tag(sync=True)
    _view_module = Unicode(MODULE_NAME).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    image = NDArray(dtype=np.float64, default_value=np.zeros(0, dtype=np.float64)).tag(sync=True, **array_serialization)
    # server = Unicode("http://atlantis.sci.utah.edu").tag(sync=True)
    # dataset = Unicode('').tag(sync=True)
    # tile_size = Int(512).tag(sync=True)

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)

