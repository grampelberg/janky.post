/**
 * @author: Thomas Rampelberg <thomas@saunter.org>
 *
 * Copyright(c) 2011 Thomas Rampelberg.
 */

(function() {
  
  this.janky = function(opts) {
    var form = janky._form();
    _.extend({}, janky._default_opts, opts);
    if (!opts.url) throw new Error("Must include a URL to send data to.");
    form.attr("action", opts.url);
    form.attr("method", opts.method);
    _.each(opts.data, _.bind(janky._input, this, form));
    form.submit();
    return this;
  };

  _.extend(this.janky, {
    _form: function() {
      return $("<iframe></iframe>").appendTo("body").hide().contents().find(
        "body").append("<form></form>").find("form");
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
