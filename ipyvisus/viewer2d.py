from ipywidgets import DOMWidget, register
from traitlets import Int, List, Tuple, Unicode, observe

from .__version__ import EXTENSION_SPEC_VERSION
MODULE_NAME = 'ipyvisus'


@register
class Viewer2d(DOMWidget):
    _model_name = Unicode('Viewer2dModel').tag(sync=True)
    _model_module = Unicode(MODULE_NAME).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    _view_name = Unicode('Viewer2dView').tag(sync=True)
    _view_module = Unicode(MODULE_NAME).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    server = Unicode("atlantis.sci.utah.edu").tag(sync=True)
    proxy=Unicode(None, allow_none=True).tag(sync=True)
    dataset = Unicode('').tag(sync=True)
    tile_size = Int(512).tag(sync=True)
    format = Unicode('png').tag(sync=True)
    field = Unicode('').tag(sync=True)
    time = Int(-1).tag(sync=True)

    palette_type = Unicode('')
    palette_min = Int(0)
    palette_max = Int(0)
    palette_interp = Unicode('Default')

    palette = Tuple(default_value=(), allow_none=True).tag(sync=True)

    times = List(()).tag(sync=True)
    fields = List(()).tag(sync=True)

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)

    @observe('palette_type')
    def _type(self, change):
        (type, min, max, interp) = self.palette
        self.palette = (change['new'], min, max, interp)

    @observe('palette_min')
    def _min(self, change):
        (type, min, max, interp) = self.palette
        self.palette = (type, change['new'], max, interp)

    @observe('palette_max')
    def _max(self, change):
        (type, min, max, interp) = self.palette
        self.palette = (type, min, change['new'], interp)

    @observe('palette_interp')
    def _interp(self, change):
        (type, min, max, interp) = self.palette
        self.palette = (type, min, max, change['new'])