const State = require('./state');
const { Identifier, Operator, Value, Parser } = require('./parser');

const evaluateKey = (state, line) =>
  line.length === 1 && line[0] instanceof Identifier ?
    line[0].valueOf : evaluate(state, line);

const evaluate = (state, line) =>
  line.length === 1 && line[0] instanceof Value ?
    line[0].valueOf : 999;

const operators = {
  '!': (state, A, B) => state.delete(evaluateKey(state, B)),
  '>>': (state, A, B) => state.set(evaluateKey(state, B), state),
  '<<': (state, A, B) => state.get(evaluateKey(state, B)),
  '=': (state, A, B) => state.set(evaluateKey(state, A), evaluate(state, B))
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
    });

    return state;
  };
};
