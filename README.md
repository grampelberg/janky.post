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
  requires some header hackery that isn't the easiest thing in the world.

- Flash/Silverlight - These are probably the easiest of all
  (unfortunately). You can just put a crossdomain.xml file at the remote
  server's root and you're good to go. The obvious drawbacks however, are that
  you now are requiring the use of flash or sliverlight for simple
  client/server communication.

