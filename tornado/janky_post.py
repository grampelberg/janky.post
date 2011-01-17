#
# Copyright (c) 2011 Thomas Rampelberg
#

"""
Make doing janky cross domain communication easy.
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

    def finish(self, *args, **kwargs):
        self.set_header('Content-Type', 'text/html; charset=UTF-8')
        self._write_buffer = template.generate(
            resp=json.dumps("".join(self._write_buffer)),
            origin=json.dumps(urlparse.urljoin(self.get_argument('_origin'),
                                               '/dne')))

        return tornado.web.RequestHandler.finish(self, *args, **kwargs)
