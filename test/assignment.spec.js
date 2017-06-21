const lava = require('../lava');

describe('lava value assignment', () => {
  subject(() => lava('x: 1'));

  it('can set a number', () => {
    const scope = {};
    subject.value(scope);
    expect(scope.x).to.be(1);
  });
});
