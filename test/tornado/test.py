#
# Copyright (c) 2011 Thomas Rampelberg
#

"""
Unittests for the janky_post handler.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

import logging
from tornado.options import define, options
import tornado.testing
import unittest

class TestHandler(janky_post.Handler):
    def get(self):
        self.write({ 'foo': 'bar' })

    post = get

class AsyncHandler(janky_post.Handler):
    
    @tornado.web.asynchronous
    def get(self):
        self.write({ 'foo': 'bar' })
        self._woo()

    post = get

    def _woo(self):
        self.finish()

class BaseTest(tornado.testing.AsyncHTTPTestCase,
                 tornado.testing.LogTrapTestCase):
    pass
    
