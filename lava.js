module.exports = code => prepare(parse(code));

module.exports.state = () => new RootState();

class RootState {
  set(key, value) {
    return new State(this, key, value);
  }

  get() {
    throw new Error('Cannot get() on a root state');
  }
}

class State {
  constructor(previous, key, value) {
    this.previous = previous;
    this.key = key;
    this.value = value;
  }

  set(key, value) {
    return new State(this, key, value);
  }

  save(key) {
    return new State(this, key, this);
  }

  get(key) {
    if (key === this.key) {
      if (typeof this.value === 'undefined') {
        throw new Error(`"${key}" not defined in state`);
      }
      return this.value;
    }
    else if (this.previous) {
      return this.previous.get(key);
    }
    throw new Error(`"${key}" not defined in state`);
  }
}

class Token {
  constructor(valueOf) {
    this.valueOf = valueOf;
  }
}

class Identifier extends Token {}

class Value extends Token {}

class NumberValue extends Value {
  constructor(valueOf) {
    super(parseFloat(valueOf));
  }

  static test(candidate) {
    return /^-?[0-9]+(\.[0-9]+)?$/.test(candidate);
  }
}

class Operator extends Token {
  static test(candidate) {
    return /^[=<>]{1,3}$/.test(candidate);
  }
}

const evaluate = (state, line) => {
  if (line.length === 1 && line[0] instanceof Value) {
    return line[0].valueOf;
  }
};

const evaluateKey = (state, line) => {
  if (line.length === 1 && line[0] instanceof Identifier) {
    return line[0].valueOf;
  }
  return evaluate(state, line);
};

const save = (state, key, value) =>
  state.save(evaluateKey(state, value));

const restore = (state, key, value) =>
  state.get(evaluateKey(state, value));

const assign = (state, key, value) =>
  new State(state, evaluateKey(state, key), evaluate(state, value));

const tokenize = (current, segment) => {
  if (Operator.test(segment)) {
    current.push(new Operator(segment));
  }
  else if (NumberValue.test(segment)) {
    current.push(new NumberValue(segment));
  }
  else {
    current.push(new Identifier(segment));
  }
  return current;
}

const parse = code => code.replace(/\s*;\s*/g, '\n').split('\n').map(
  line => line.split(' ').reduce(
    (current, segment) => tokenize(current, segment), []
  )
);

const prepare = lines => state => {
  if (!state) {
    state = new RootState();
  }
  lines.map(line => {
    let key;
    let value = [];
    let operation;
    line.map(token => {
      if (token instanceof Operator) {
        switch (token.valueOf) {
          case '>>':
            operation = save;
            return;
          case '<<':
            operation = restore;
            return;
          case '=':
            key = value;
            value = [];
            operation = assign;
            return;
        }
      }
      value.push(token);
    });
    if (operation) {
      state = operation(state, key, value);
    }
  });
  return state;
};
