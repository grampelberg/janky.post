#
# Copyright (c) 2011 Thomas Rampelberg
#

"""Making cross-domain requests easy on the server (for tornado).

Here's a canonical use of janky.post in Tornado:

    import janky_post.tornado_handler
    import tornado.ioloop
    import tornado.web

    class MainHandler(janky_post.tornado_handler.Handler):
        def get(self):
            self.write({ "status": "ok", data: "foobar" })

    if __name__ == "__main__":
        application = tornado.web.Application([
            (r"/", MainHandler),
        ])
        application.listen(8888)
        tornado.ioloop.IOLoop.instance().start()

See the readme at https://github.com/pyronicide/janky.post for more details.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

import json
import tornado.template
import tornado.web
import urlparse

tmpl = """
<html><head></head>
<body><script type="text/javascript">
  window.name = {{ resp }};
  location.href = {{ origin }};
</script></body></html>
"""

template = tornado.template.Template(tmpl)

class Handler(tornado.web.RequestHandler):
    """Subclass this class just as you would tornado.web.RequestHandler."""

    def finish(self, *args, **kwargs):
        self.set_header('Content-Type', 'text/html; charset=UTF-8')
        self._write_buffer = template.generate(
            resp=json.dumps("".join(self._write_buffer)),
            origin=json.dumps(urlparse.urljoin(self.get_argument('_origin'),
                                               '/janky.html')))

        return tornado.web.RequestHandler.finish(self, *args, **kwargs)
