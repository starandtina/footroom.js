(function ($) {
  module('jQuery#footroom', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.footroom(), this.elems, 'should be chainable');
  });

  test('is footroom', function () {
    expect(1);
    strictEqual(this.elems.footroom().text(), 'footroom0footroom1footroom2', 'should be footroom');
  });

}(jQuery));
