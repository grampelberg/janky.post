# Why, for goodness sakes, why?!?

By default, javascript keeps you pretty tied down security wise. You can only
send XHR requests to the same domain. And, of course, the port is part of what
is thought of as the "domain" (eg. http://example.com:80 is a separate domain
from http://example.com:8080). With the advent of services everywhere, it has
become more and more important to be able to pass data from one domain to
another. Not only do you not want to see that data but it doesn't make sense to
have an extra request hitting your server just to proxy it on back to the
service that you're using.

There are many different ways to do cross-domain communication in javascript
but they all have tradeoffs unfortunately:

- JSONP - This adds `<script src="http://example.com/remote?callback=foo"></script>` to your web
  page. When the server receives this, it will write you back a script along
  the lines of `foo({ data: "my response" })`. On the plus side, this is pretty
  easy from both the client (there's great support in jquery) and the
  server. Unfortunately, you don't get any real information on errors that
  occur to the request and you're limited to GET requests. Since GET requests
  are limited to about 2k, this ends up being very limiting for any large
  requests.

- Access-Control - Modern browsers add an Access-Control header to XHR
  requests. If the server responds in kind, your request is allowed
  through. Just like JSONP, this is really easy on the client
  side. Unfortunately, IE6/7 are completely unsupported and IE8 needs a bunch
  of special treatment that isn't implemented in common libraries. It also
  requires some header hackery that isn't the easiest thing in the
  world. Finally, these requests are actually 2 requests in sequence (one to
  get the Access-Control restrictions, the second to actually send the
  request). This just adds latency to your users that they don't need.

- Flash/Silverlight - These are probably the easiest of all
  (unfortunately). You can just put a crossdomain.xml file at the remote
  server's root and you're good to go. The obvious drawbacks however, are that
  you now are requiring the use of flash or sliverlight for simple
  client/server communication.

janky.post tries to fix some of these drawbacks. Here's a quick example of
doing a cross domain request from your local page:

    janky({ url: "http://example.com:8080/api", 
            data: { foo: 'bar', baz: [1,2,3] }, 
            success: function(resp) {
              console.log('server responded with: ' + resp);
            }, 
            error: function() {
              console.log('error =(');
            }
    });

That example basically replicates a JSONP result (but you'll notice that
there's actually errors that occur, no firing requests into the ether). The
other cool feature that janky.post gets you is the ability to do POST along
with GET. Just add `method: "post"` to your janky options and you're set.

# Getting setup

On the client side, there's only one dependency for janky.post, json2.js (for
IE support). You've probably already got json2.js added somewhere but if you
don't, you can get it from [the source](http://json.org/json2.js). Then, just
add janky.post to the script blocks of your page and you're ready to go.

    <script src="scripts/json2.js"></script>
    <script src="scripts/janky.post.min.js"></script>

# Server side support

The list of server side support currently includes:

- [Tornado](https://github.com/pyronicide/janky.post/tree/master/tornado)

Please tell me if you implement the server side support for any framework so
that I can add it to the list.

## Implementing server side support in your own framework

I'd suggest taking a look at how this whole thing works first. But, if you'd
like to skip to the instant howto ....

As a response, instead of sending back the normal response, you need to send
back:

    <html>
    <head></head>
    <body>
        <script type="text/javascript">
            window.name = "json serialized string containing the response";
            location.href = "_origin domain from request + /janky";
        </script>
    </body>
    </html>

A couple gotchas:

- The content-type needs to be `text/html`. If you try to do
  `application/json`, bad things happen.

- Make sure that your response has been serialized via. JSON as the client
  library will be expecting that.

- There is an `_origin` parameter added to every request. Take the root domain
  of that and then add `/janky`. For example, if
  `_origin=http://example.com:8080/foo/bar.html`, you would set `location.href`
  to `http://example.com:8080/janky`. It is important that this gets set this
  way (so that there's a 404 generated and the other server doesn't need to
  send any more data).
