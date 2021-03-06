#
# Copyright (c) 2011 Thomas Rampelberg
#

"""
Test the janky request handler.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

import logging
import tornado.httpclient
import tornado.httpserver
import tornado.ioloop
from tornado.options import define, options
import tornado.web

import janky_post.tornado_handler

class JankySyncHandler(janky_post.tornado_handler.Handler):

    def get(self):
        self.write({ "method": "get", "foo": self.get_argument("foo", "none") })

    def post(self):
        self.write({ "method": "post", "foo": self.get_argument("foo", 
                                                                "none") })

class JankyAsyncHandler(janky_post.tornado_handler.Handler):
    @tornado.web.asynchronous
    def get(self):
        self.write({ "method": "get" })
        self.foo()

    @tornado.web.asynchronous
    def post(self):
        self.write({ "method": "post" })
        self.foo()

    def foo(self):
        self.finish()


def config():
    define('port', default=5000, type=int, help='Port to listen on.')
    define('debug', default=False, type=bool,
           help='Start the server in debug mode')
    tornado.options.parse_command_line()

routes = lambda: [(r"/janky", JankySyncHandler),
                  (r"/a/janky", JankyAsyncHandler)]

def start():
    config()
    app = tornado.web.Application(routes(), **{
            "debug": options.debug
            })
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    start()
