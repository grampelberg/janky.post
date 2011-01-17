/**
 * @author: Thomas Rampelberg <thomas@saunter.org>
 *
 * Copyright(c) 2011 Thomas Rampelberg.
 */

(function() {
  
  this.janky = function(opts) {
    var res = janky._form();    
    var iframe = res[0];
    var form = res[1];
    _.extend({}, janky._default_opts, opts);
    if (!opts.url) throw new Error("Must include a URL to send data to.");
    form.attr("action", opts.url);
    form.attr("method", opts.method);
    _.extend(opts.data, {
      _origin: location.href
    });
    _.each(opts.data, _.bind(janky._input, this, form));
    iframe.load(function() {
      var resp = iframe.get(0).contentWindow.name
      if (!resp) return
      _.defer(function() { iframe.remove() });
      opts.success && opts.success(JSON.parse(resp));
    });
    form.submit();
  };

  _.extend(this.janky, {
    _form: function() {
      var iframe = $("<iframe></iframe>").appendTo("body").hide();
      return [iframe, iframe.contents().find(
        "body").append("<form></form>").find("form")];
    },
    _default_opts: {
      method: 'get'
    },
    _input: function(form, v, k) {
      var val = v;
      if (!_.isString(val))
        val = JSON.stringify(val);
      $("<input type='hidden'></input>").appendTo(form).attr(
        "name", k).val(val);
    }
  });
})();
