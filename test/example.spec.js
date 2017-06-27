const lava = require('../lava');

describe('lava (assignment)', () => {
  context('create a person', () => {
    subject(() => lava('name = "Robert" ; age = 28 ; >>> person'));

    it('returns a state where name is not defined', () => {
      const state = subject.now();
      expect(state.defined('name')).to.be(false);
    });

    it('returns a state where person is defined', () => {
      const state = subject.now();
      expect(state.defined('person')).to.be(true);
    });

    it('returns a state where person.name is defined', () => {
      const state = subject.now();
      expect(state.get('person').defined('name')).to.be(true);
    });

    it('returns a state where person.name is "Robert"', () => {
      const state = subject.now();
      expect(state.get('person').get('name')).to.be('Robert');
    });

    it('returns a state where person.age is defined', () => {
      const state = subject.now();
      expect(state.get('person').defined('age')).to.be(true);
    });

    it('returns a state where person.age is 28', () => {
      const state = subject.now();
      expect(state.get('person').get('age')).to.be(28);
    });
  });
});
