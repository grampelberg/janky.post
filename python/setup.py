#
# Copyright (c) 2011 Thomas Rampelberg
#

"""
Make doing janky cross domain communication easy.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

from setuptools import setup, find_packages

setup(
    name = "janky_post",
    version = "0.5",
    author = __author__,
    author_email = __author_email__,
    url = "http://saunter.org/janky.post/",
    description = "Makes janky cross-domain communication easy",
    packages = find_packages()
)
