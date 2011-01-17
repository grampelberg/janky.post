/**
 * @author: Thomas Rampelberg <thomas@saunter.org>
 *
 * Copyright(c) 2011 Thomas Rampelberg.
 */

$(function() {
  $("form").submit(function() {
    janky({
      url: 'http://localhost:5000/api',
      method: 'post',
      data: {
        one: $("input[name=one]").val(),
        two: $("input[name=two]").val(),
        time: new Date().getTime()
      },
      success: function(resp) {
        var elem = $("<pre><code></code></pre>");
        var str = JSON.stringify(resp).split(',').join(',\r\n    ').split(
          '{').join('{\r\n    ').split('}').join('\r\n}');
        elem.find("code").html(str);
        $("h2:contains(Output)").after(elem);
      }
    });
    return false;
  });
});
