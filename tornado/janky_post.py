#
# Copyright (c) 2011 Thomas Rampelberg
#

"""
Make doing janky cross domain communication easy.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

import functools

def handler(method):
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        return method(self, *args, **kwargs)
    return wrapper
