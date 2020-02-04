from ipywidgets import DOMWidget, register
from traitlets import Int, Unicode

from .__version__ import EXTENSION_SPEC_VERSION
MODULE_NAME = '@visus/ipyvisus'


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

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)

