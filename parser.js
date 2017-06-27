/**
 * An abstract token
 */
class Token {
  constructor(valueOf) {
    this.valueOf = valueOf;
  }
}

/**
 * An identifier
 */
class Identifier extends Token {}

/**
 * An operator
 */
class Operator extends Token {
  static testOperator(candidate) {
    return /^[!=<>]{1,3}$/.test(candidate);
  }
}

/**
 * A value
 */
class Value extends Token {
  static testFloat(candidate) {
    return /^-?[0-9]+\.[0-9]*$/.test(candidate);
  }

  static testInteger(candidate) {
    return /^-?[0-9]+$/.test(candidate);
  }
}

/**
 * A lava code parser
 */
class Parser {
  static parse(code) {
    return code.replace(/\s*;\s*/g, '\n').split('\n').map(
      line => line.split(' ').reduce(
        (current, segment) => Parser.tokenize(current, segment), []
      )
    );
  }

  static tokenize(current, segment) {
    if (Operator.testOperator(segment)) {
      current.push(new Operator(segment));
    }
    else if (Value.testFloat(segment)) {
      current.push(new Value(parseFloat(segment)));
    }
    else if (Value.testInteger(segment)) {
      current.push(new Value(parseInt(segment)));
    }
    else {
      current.push(new Identifier(segment));
    }
    return current;
  }
}

module.exports = {
  Identifier,
  Operator,
  Value,
  Parser
};
