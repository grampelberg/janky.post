Here's a canonical use of janky.post in Tornado:

    import janky_post
    import tornado.ioloop
    import tornado.web

    class MainHandler(janky_post.Handler):
        def get(self):
            self.write({ "status": "ok", data: "foobar" })

    if __name__ == "__main__":
        application = tornado.web.Application([
            (r"/", MainHandler),
        ])
        application.listen(8888)
        tornado.ioloop.IOLoop.instance().start()
