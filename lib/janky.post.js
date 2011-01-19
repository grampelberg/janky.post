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
    var res = janky._form();
    var win = res[0];
    var form = res[1];
    var opts = extend({}, janky._default_opts, opts);
    if (!opts.url) throw new Error("Must include a URL to send data to.");
    form.setAttribute("action", opts.url);
    form.setAttribute("method", opts.method);
    opts.data = extend({}, opts.data, {
      _origin: location.href
    });
    janky._input(form, opts.data);
    iframe.onload = function() {
      setTimeout(function() { document.body.removeChild(iframe) }, 1);
      if (!win.location.href)
        return opts.error && opts.error();
      var resp = win.name;
      opts.success && opts.success(JSON.parse(resp));
    };
    form.submit();
  };

  this.janky._form = function() {
    var iframe = document.createElement("iframe");
    var name = (Math.random() * 1E16).toString(36).slice(0,10);
    iframe.setAttribute('name', name)
    document.body.appendChild(iframe);
    var win = window.frames[name];
    iframe.style.display = "none";
    var form = document.createElement("form");
    win.document.body.appendChild(form);
    return [iframe, win];
  };
  this.janky._default_opts = {
    method: 'get'
  };
  this.janky.is_string = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr))
  };
  this.janky._input = function(form, data) {
    for (var k in data) {
      var val = data[k];
      if (!janky.is_string(val))
        val = JSON.stringify(val);
      var inp = document.createElement("input");
      inp.setAttribute("type", "hidden");
      inp.setAttribute("name", k);
      inp.value = val;
      form.appendChild(inp);
    };
  };
})();
