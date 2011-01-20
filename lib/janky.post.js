/**
 * @author: Thomas Rampelberg <thomas@saunter.org>
 *
 * Copyright(c) 2011 Thomas Rampelberg.
 */

(function() {

  var extend = function(obj) {
    var rest = Array.prototype.slice.call(arguments, 1);
    for (var i=0,j=rest.length; i<j; i++) {
      for (var prop in rest[i]) obj[prop] = rest[i][prop];
    }
    return obj;
  };

  this.janky = function(opts) {
    janky._form(function(iframe, form) {
      opts = extend({}, janky._default_opts, opts);
      if (!opts.url) throw new Error("Must include a URL to send data to.");
      form.setAttribute("action", opts.url);
      form.setAttribute("method", opts.method);
      opts.data = extend({}, opts.data, {
        _origin: location.href
      });
      janky._input(iframe, form, opts.data);
      var _response = function(resp) {
        window.detachEvent && window.detachEvent('onmessage', _response);
        window.removeEventListener && window.removeEventListener('message', 
                                                                 _response);
        setTimeout(function() { document.body.removeChild(iframe) }, 1);
        opts.success && opts.success(JSON.parse(resp.data));
      };
      window.attachEvent && window.attachEvent('onmessage', _response);
      window.addEventListener && window.addEventListener(
        "message", _response, false);
      // IE<8 must use window.name
      iframe.onreadystatechange = function() {
        if (typeof(window.postMessage) != 'undefined' ||
            iframe.readyState != 'complete') return
        _response({ data: iframe.contentWindow.name });
      };
      form.submit();
    });
  };

  this.janky._form = function(cb) {
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    // IE creates the document only after yielding
    setTimeout(function() {
      var form = iframe.contentWindow.document.createElement("form");
      iframe.contentWindow.document.body.appendChild(form);
      cb(iframe, form);
    }, 0);
  };
  this.janky._default_opts = {
    method: 'get'
  };
  this.janky.is_string = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr))
  };
  this.janky._input = function(iframe, form, data) {
    for (var k in data) {
      var val = data[k];
      if (!janky.is_string(val))
        val = JSON.stringify(val);
      var inp = iframe.contentWindow.document.createElement("input");
      inp.setAttribute("type", "hidden");
      inp.setAttribute("name", k);
      inp.value = val;
      form.appendChild(inp);
    };
  };
})();
