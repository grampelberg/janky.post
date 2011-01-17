---
title: Official janky.post demo
layout: demo
---

# janky.post demo!

This demo will send a POST request to another server and then display the
response. Fill out the form with whatever text you'd like, it will end up being
echo'd back to you.

## Input

<form>
  <fieldset>
  <label for="one">one</label>
  <input type="text" name="one" />
  <label for="two">two</label>
  <input type="text" name="two" />
  <button>Send Data</button>
  </fieldset>
</form>

## Output

# Code

    {% highlight js %}
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
    {% endhighlight %}
