#
# Copyright (c) 2011 Thomas Rampelberg
#

"""
Unittests for the janky_post handler.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

import logging
import re
from tornado.options import define, options
import tornado.testing
import tornado.web
import urllib
import unittest

import janky_post.tornado_handler

class TestHandler(janky_post.tornado_handler.Handler):
    def get(self):
        self.write({ 'foo': 'bar' })

    post = get

class AsyncHandler(janky_post.tornado_handler.Handler):
    
    @tornado.web.asynchronous
    def get(self):
        self.write({ 'foo': 'bar' })
        self._woo()

    post = get

    def _woo(self):
        self.finish()

class HandlerTest(tornado.testing.AsyncHTTPTestCase,
                  tornado.testing.LogTrapTestCase):
    
    def get_app(self):
        return tornado.web.Application([("/", TestHandler),
                                        ("/a", AsyncHandler)])
    

    def test_get(self):
        resp = self.fetch(
            '/?' + urllib.urlencode({ 
                        '_origin': 'http://example.com:8080/foo/bar'}))
        
        assert re.search('window.name', resp.body)
        assert re.search('location.href = "http://example.com:8080/janky";',
                         resp.body)

def all():
    return unittest.defaultTestLoader.loadTestsFromNames(['test'])

if __name__ == '__main__':
    tornado.testing.main()
