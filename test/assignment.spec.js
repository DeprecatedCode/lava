const lava = require('../lava');

describe('lava value assignment', () => {
  context('the number 1', () => {
    subject(() => lava('x = 1'));

    it('can be set as the value of "x"', () => {
      const finalState = subject.now();
      expect(finalState.get('x')).to.be(1);
    });
  });

  context('the number 2', () => {
    subject(() => lava('x = 2'));

    it('can be set as the value of "x"', () => {
      const finalState = subject.now();
      expect(finalState.get('x')).to.be(2);
    });
  });

  context('multiple assignment to same key', () => {
    subject(() => lava('x = 1 ; x = 2 ; x = 3'));

    it('can be used to overwrite "x"', () => {
      const finalState = subject.now();
      expect(finalState.get('x')).to.be(3);
    });
  });

  context('store and rewind operator', () => {
    subject(() => lava('x = 1 ; >> initial ; x = 2 ; x = 3 ; << initial'));

    it('can be used to rewind "x"', () => {
      const finalState = subject.now();
      expect(finalState.get('x')).to.be(1);
    });
  });

  context('multiple keys assignment', () => {
    subject(() => lava('x = 1 ; y = 2 ; z = 3'));

    it('can independently set values for keys', () => {
      const finalState = subject.now();
      expect(finalState.get('x')).to.be(1);
      expect(finalState.get('y')).to.be(2);
      expect(finalState.get('z')).to.be(3);
    });
  });
});
