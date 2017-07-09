const lava = require('../lava');

describe('lava (global)', () => {
  context('access globals', () => {
    subject(() => lava('log = global.console.log'));

    it('returns a state where log is defined', () => {
      const state = subject.now();
      expect(state.defined('log')).to.be(true);
    });

    it('returns a state where log is console.log', () => {
      const state = subject.now();
      expect(state.get('log')).to.be(console.log);
    });
  });
});
