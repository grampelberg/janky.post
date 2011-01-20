# What is this?

janky.post is a javascript library that simplifies cross-domain
request/response communication using regular GET/POST for the request and an
easy to implement response format.

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

# Demo!

Take some time to play around with [the
demo](http://saunter.org/janky.post/demo). It should give you a good idea of
what you can do with janky.post.

# Getting setup

On the client side, there's only one dependency for janky.post: json2.js (for
IE support). You've probably already have json2.js added somewhere on the page
but if you don't, you can get it from [the
source](http://json.org/json2.js). Then, just add janky.post to the script
blocks of your page and you're ready to go. (Take a look in the lib directory
for both the minified and the verbose versions).

    <script src="http://saunter.org/janky.post/scripts/json2.js"></script>
    <script src="http://saunter.org/janky.post/lib/janky.post.min.js"></script>

Note that if you're supporting IE6/7, make sure you also add an empty, static
page at http://local_server/janky.html.

## Demo server

To aid in testing the client side of this, once you've added the two scripts
above to your pages, try using the demo server to see if everything's working
right. To use the demo server, you do something like the following:

    janky({ url: "http://api.jankypost.com/api",
            data: { ninja: false, robot: true },
            success: function(resp) { console.log(resp) }
    });

# Using janky.post

There's only one function call - `janky(settings)`. The settings are:

- url - Location to send the request to

- data - An object containing key/value pairs to send to the server. The values
  can be anything that is JSON serializable.

- method - The method to use. For now, this is either GET or POST.

- success - Function to call with the response's result. This is called with
  the JSON parsed results of the respons from the remote server.

- error - If any errors occur once the request has been issued, this will be
  called. At the moment, there are no arguments to this.

## Example

    janky({ url: "http://example.com:8080/foo/bar",
            data: { style: 'foo', ninja: true },
            method: "post",
            success: function(resp) {
              console.log('server response: ' + resp);
            },
            error: function() {
              console.log('there was an error');
            }
    });

# Server side support

The list of server side support currently includes:

- [Tornado](https://github.com/pyronicide/janky.post/tree/master/python)
- [Google App Engine](https://github.com/pyronicide/janky.post/tree/master/python)


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
            window.parent.postMessage ? window.parent.postMessage(window.name, "*") :
                location.href = "_origin domain from request + /janky.html";
        </script>
    </body>
    </html>

A couple gotchas:

- The content-type needs to be `text/html`. If you try to do
  `application/json`, bad things happen.

- Make sure that your response has been serialized via. JSON as the client
  library will be expecting that.

- There is an `_origin` parameter added to every request. Take the root domain
  of that and then add `/janky.html`. For example, if
  `_origin=http://example.com:8080/foo/bar.html`, you would set `location.href`
  to `http://example.com:8080/janky.html`. It is important that this gets set
  this way (so that IE6/7 have a page to redirect back to for the iframe).

# How it all works

1. The browser creates a hidden iframe with an empty source (still on the local
   domain).

5. An `onload` event is attached to the iframe

2. A form is added to the body of that iframe.

3. The `action` parameter of the form is set to the remote server.

4. For each k/v pair in `data` a hidden input is created inside this form.

6. The form is submitted (now on the remote domain).

7. At this point, the iframe's location.href is on the remote server. This
   makes it so that the browser can't get at any data but the remote server's
   page can do anything it wants to the iframe's window.

8. The remove server creates a web page that calls window.parent.postMessage().

9. The `message` (or `onmessage`) event in the parent frame (local server)
   fires and your `success` method is called.

For some discussion on postMessage, take a look at
[MDC](https://developer.mozilla.org/En/DOM/Window.postMessage).

Note that for IE6 and 7 there's a different method used. Instead of using
postMessage, `window.name` is used. This means that the request goes to the
remote server which then redirects back to the local server. The reason that
this works has to do with how `window.name` is implemented. At a high level,
`window.name` is not reset when a page changes, so when the page has been
redirected back to the local domain, the full response can be fetched. There
are limits on the response size using this method but the limits are somwhere
in the 10mb range. Note that the only limits placed on requests themselves are
the normal form limitations.
