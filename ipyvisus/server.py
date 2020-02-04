from aiohttp import web
import asyncio
import nest_asyncio

nest_asyncio.apply()


class VisusSever(object):
    def __init__(self):
        self.task = None
        self.app = None
        self._setup()

    def _setup(self):
        routes = web.RouteTableDef()

        @routes.get('/')
        async def tile(request):
            return web.Response(text=f"Visus={visus}")

        self.app = web.Application()
        self.app.add_routes(routes)

    async def _run(self):
        web.run_app(self.app)

    def run(self):
        if self.task is None:
            try:
                self.task = asyncio.create_task(self._run())
            except asyncio.CancelledError:
                print('canceled')

    def stop(self):
        if self.task is not None:
            self.task.cancel()
            self.task = None
        else:
            print('Visus server not running')