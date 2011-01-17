#
# Copyright (c) 2011 Thomas Rampelberg
#

"""Making cross-domain requests easy on the server (for GAE).

To make use of this, create a file called `appengine_config.py` in the root of
your app's directory. Then, add this:

    import janky_post.gae

    def webapp_add_wsgi_middleware(app):
        app = janky_post.gae.JankyMiddleware(app)
        return app

When you do a normal `self.response.out.write()` call, make sure to serialize
your response with `json.dumps()` first. To see something working, you can
check out [the
demo](https://github.com/pyronicide/janky.post/tree/master/test/gae).

See the readme at https://github.com/pyronicide/janky.post for more details.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

from django.utils import simplejson as json
from google.appengine.ext import webapp
import logging
import urlparse

class JankyMiddleware(object):
    """WSGI middleware that adds janky support."""

    tmpl = """<html><head></head><body>
<script type="text/javascript">
  window.name = %(resp)s;
  location.href = %(origin)s;
</script>
</body></html>
"""

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def my_start_response(status, headers, exc_info=None):
            write = start_response(status, headers, exc_info)
            def my_write(body):
                if not body: return
                origin = webapp.Request(environ).get('_origin')
                if origin:
                    body = self.tmpl % { 
                        'resp': json.dumps(body), 
                        'origin': json.dumps(urlparse.urljoin(
                                webapp.Request(environ).get('_origin'), 
                                '/janky'))
                        }
                write(body)
            return my_write
        return self.app(environ, my_start_response)
