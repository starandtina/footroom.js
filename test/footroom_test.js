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
    strictEqual(this.elems.footroom().text(), 'lame test markupnormal test markupawesome test markup', 'should be footroom');
  });

}(jQuery));
