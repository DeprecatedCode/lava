/**
 * Internal use
 */
const parentMap = new WeakMap();

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
    if (key === 'global') {
      return global;
    }
    throw new Error(`"${key}" is not defined`);
  }

  set(key, value) {
    if (key === this.key && value === this.value) {
      return this;
    }
    return new KeyValueState(this, key, value);
  }

  store(key, value) {
    const circularStateReference = value.set(key);
    circularStateReference.value = circularStateReference;
    return this.set(key, circularStateReference);
  }
}

/**
 * A state representing a deleted key
 */
class EmptyKeyState extends EmptyState {
  constructor(parent, key) {
    super();
    parentMap.set(this, parent);
    this.key = key;
  }

  defined(key) {
    return key === this.key ? false : parentMap.get(this).defined(key);
  }

  get(key) {
    if (key === this.key) {
      throw new Error(`"${key}" is not defined`);
    }
    return parentMap.get(this).get(key);
  }
}

/**
 * A state representing a key value pair
 */
class KeyValueState extends EmptyState {
  constructor(parent, key, value) {
    super();
    parentMap.set(this, parent);
    this.key = key;
    this.value = value;
  }

  defined(key) {
    return key === this.key ? true : parentMap.get(this).defined(key);
  }

  delete(key) {
    return this.defined(key) ? new EmptyKeyState(this, key) : this;
  }

  get(key) {
    return key === this.key ? this.value : parentMap.get(this).get(key);
  }
}

module.exports = EmptyState;
