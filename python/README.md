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
