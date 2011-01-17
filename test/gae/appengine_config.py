#
# Copyright (c) 2011 Thomas Rampelberg
#

"""Add JankyMiddleware into the actual stack."""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@saunter.org'

import janky_post.gae

def webapp_add_wsgi_middleware(app):
    app = janky_post.gae.JankyMiddleware(app)
    return app
