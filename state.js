/**
 * The root of all states
 */
class EmptyState {
  defined(key) {
    return false;
  }

  delete(key) {
    return key === this.key ? this : new EmptyKeyState(this, key);
  }

  get(key) {
    throw new Error(`"${key}" is not defined`);
  }

  set(key, value) {
    if (key === this.key && value === this.value) {
      return this;
    }
    return new KeyValueState(this, key, value);
  }
}

/**
 * A state representing a deleted key
 */
class EmptyKeyState extends EmptyState {
  constructor(parent, key) {
    super();
    this.parent = parent;
    this.key = key;
  }

  defined(key) {
    return key === this.key ? false : this.parent.defined(key);
  }

  get(key) {
    if (key === this.key) {
      throw new Error(`"${key}" is not defined`);
    }
    return this.parent.get(key);
  }
}

/**
 * A state representing a key value pair
 */
class KeyValueState extends EmptyState {
  constructor(parent, key, value) {
    super();
    this.parent = parent;
    this.key = key;
    this.value = value;
  }

  defined(key) {
    return key === this.key ? true : this.parent.defined(key);
  }

  delete(key) {
    return this.defined(key) ? new EmptyKeyState(this, key) : this;
  }

  get(key) {
    return key === this.key ? this.value : this.parent.get(key);
  }
}

module.exports = EmptyState;
