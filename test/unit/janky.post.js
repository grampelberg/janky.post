/**
 * @author: Thomas Rampelberg <thomas@saunter.org>
 *
 * Copyright(c) 2011 Thomas Rampelberg.
 */

module("janky");

test("get", function() {
  raises(function() {
    janky();
  });
  raises(function() {
    janky({});
  });
  ok(!janky({ url: 'http://localhost:5000/janky' }));
  stop(1000);
  janky({
    url: 'http://localhost:5000/as',
    error: function() {
      ok(true, 'called');
      janky({
        url: 'http://localhost:5000/janky',
        data: { foo: 'bar' },
        success: function(resp) {
          same(resp, { foo: 'bar', method: 'get' });
          start();
          equals(document.getElementsByTagName("iframe").length, 3);
        }
      });
    }
  });
});

test("post", function() {
  stop(1000);
  janky({
    url: 'http://localhost:5000/janky',
    data: { foo: 'rab' },
    method: 'post',
    success: function(resp) {
      same(resp, { foo: 'rab', method: 'post' });
      start();
    }
  });
});
