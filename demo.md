---
title: Official janky.post demo
layout: demo
---

# janky.post demo!

This demo will send a POST request from `http://saunter.org/` to
`http://api.jankypost.com` and then display the response. Fill out the form
with whatever text you'd like, it will end up being echo'd back to you.

After you've played around with this a bit, make sure you get your browser's
console out and see what you can do.

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

You can also [download the code](http://saunter.org/janky.post/test/demo.js).

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
