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
    var iframe = res[0];
    var form = res[1];
    extend({}, janky._default_opts, opts);
    if (!opts.url) throw new Error("Must include a URL to send data to.");
    form.attr("action", opts.url);
    form.attr("method", opts.method);
    extend(opts.data, {
      _origin: location.href
    });
    janky._input(form, opts.data);
    iframe.load(function() {
      setTimeout(function() { iframe.remove() }, 1);
      if (!iframe.get(0).contentWindow.location.href)
        return opts.error && opts.error();
      var resp = iframe.get(0).contentWindow.name;
      opts.success && opts.success(JSON.parse(resp));
    });
    form.submit();
  };

  this.janky._form = function() {
    var iframe = $("<iframe></iframe>").appendTo("body").hide();
    return [iframe, iframe.contents().find(
      "body").append("<form></form>").find("form")];
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
      $("<input type='hidden'></input>").appendTo(form).attr(
        "name", k).val(val);
    };
  };
})();
