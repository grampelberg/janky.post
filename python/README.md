To get the package:

    pip install janky_post

# Tornado

Here's a canonical use of janky.post in Tornado:

    import janky_post.tornado_handler
    import tornado.ioloop
    import tornado.web

    class MainHandler(janky_post.tornado_hander.Handler):
        def get(self):
            self.write({ "status": "ok", data: "foobar" })

    if __name__ == "__main__":
        application = tornado.web.Application([
            (r"/", MainHandler),
        ])
        application.listen(8888)
        tornado.ioloop.IOLoop.instance().start()

Take a look at the actual [test
server](https://github.com/pyronicide/janky.post/blob/master/test/tornado/serve.py)
if there's any confusion.

# Google App Engine

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
