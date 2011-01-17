#
# Copyright (c) 2011 Thomas Rampelberg
#

"""Making cross-domain requests easy on the server (for GAE).

This is a really basic example of using the middleware to get janky.post
working with GAE. Note that this is up and used as a demo (to make sure people
have something to test against on the client side).

See the readme at https://github.com/pyronicide/janky.post for more details.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

import json

class MainPage(webapp.RequestHandler):

    def get(self):
        self.redirect('http://saunter.org/janky.post')

class APIPage(webapp.RequestHandler):
    def post(self):
        resp = { 'method': self.request.environ.get('REQUEST_METHOD') }
        resp.update(self.request.params)
        self.response.out.write(json.dumps(resp))

    get = post

application = webapp.WSGIApplication(
    [('/', MainPage),
     ('/api', APIPage)],
    debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
