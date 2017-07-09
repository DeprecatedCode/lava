const State = require('./state');
const { Identifier, Operator, Value, Parser } = require('./parser');

const evaluateKey = (state, line) =>
  line.length === 1 && line[0] instanceof Identifier ?
    line[0].valueOf : evaluate(state, line);

const evaluate = (state, line) =>
  line.length === 1 && line[0] instanceof Value ?
    line[0].valueOf : chain(state, line);

const chain = (state, line) =>
  line.length === 1 && line[0] instanceof Identifier ?
  getChain(state, line[0].valueOf.split('.')) : console.log('DO', line);

const get = (state, key) => {
  if (state === null) {
    throw new Error(`Cannot get property '${key}' of null`);
  }
  if (typeof state === 'undefined') {
    throw new Error(`Cannot get property '${key}' of undefined`);
  }
  return state instanceof State ? state.get(key) : state[key];
};

const getChain = (state, keys) =>
  keys.length === 1 ? get(state, keys.shift()) : getChain(get(state, keys.shift()), keys);

const operators = {
  '=': (state, A, B) => state.set(evaluateKey(state, A), evaluate(state, B)),
  '!': (state, A, B) => state.delete(evaluateKey(state, B)),
  '>>': (state, A, B) => {
    if (A.length && B.length) {
      throw new Error('TODO merge states');
    }
    else if (A.length) {
      return state.store(evaluateKey(state, A), state);
    }
    else if (B.length) {
      return state.set(evaluateKey(state, B), state);
    }
    else {
      throw new Error('Token >> used with no parameters');
    }
  },
  '<<': (state, A, B) => state.get(evaluateKey(state, B)),
  '>>>': (state, A, B) => {
    if (A.length && B.length) {
      throw new Error('TODO merge states');
    }
    else if (A.length) {
      const blank = new State();
      return blank.store(evaluateKey(state, A), state);
    }
    else if (B.length) {
      const blank = new State();
      return blank.set(evaluateKey(state, B), state);
    }
  }
};

module.exports = code => {
  const parsed = Parser.parse(code);
  return state => {
    if (!state) {
      state = new State();
    }

    parsed.forEach(line => {
      let A = [];
      let operator = null;
      let B = null;
      line.forEach(token => {
        if (token instanceof Operator) {
          if (operator) {
            throw new Error('TODO handle multi-op lines');
          }
          operator = token;
          B = [];
        }
        else if (operator) {
          B.push(token);
        }
        else {
          A.push(token);
        }
      });
      if (operator && operator.valueOf in operators) {
        state = operators[operator.valueOf](state, A, B);
        if (!(state instanceof State)) {
          throw new Error(`Operator "${operator.valueOf}" did not return a state`);
        }
      }
      else if (operator) {
        throw new Error(`Operator "${operator.valueOf}" is not defined`);
      }
      else {
        console.log('A is', A, 'B is', B);
      }
    });

    return state;
  };
};
