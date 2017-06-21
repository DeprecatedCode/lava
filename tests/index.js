const rootSuites = [];
let currentSuite = { childSuites: rootSuites };
let hasSubject = false;
let activeSubject;

global.describe = global.context = (description, executor) => {
  let parentSuite = currentSuite;
  currentSuite = {
    description,
    it: [],
    subject: undefined,
    scope: {},
    childSuites: [],
    parentSuite
  };
  parentSuite.childSuites.push(currentSuite);
  executor();
  currentSuite = parentSuite;
};

global.it = (description, executor) => {
  currentSuite.it.push({ description, executor });
};

global.subject = executor => {
  currentSuite.subject = executor;
};

Object.defineProperty(global.subject, 'value', {
  get: () => {
    if (!hasSubject) {
      let candidateSuite = currentSuite;
      while (candidateSuite && !hasSubject) {
        if (candidateSuite.subject) {
          hasSubject = true;
          activeSubject = currentSuite.subject();
        }
        candidateSuite = candidateSuite.parentSuite;
      }
      if (!hasSubject) {
        throw new Error("subject(() => 'example-subject'); must be provided");
      }
    }
    return activeSubject;
  }
});

global.expect = value => {
  const expectations = {
    be: expected => {
      if (expected !== value) {
        throw new Error(`Expected ${expected}, got ${value}`);
      }
    }
  };
  expectations.to = expectations;
  return expectations;
};

const executeSuite = (suite, depth = '') => {
  console.log(depth + suite.description);
  currentSuite = suite;
  suite.it.forEach((test) => {
    hasSubject = false;
    activeSubject = undefined;
    try {
      test.executor();
      console.log(depth + '  ✔ ' + test.description);
    }
    catch (error) {
      console.log(depth + '  ✘ ' + test.description);
      console.error(error);
    }
  });

  suite.childSuites.forEach(suite =>
    executeSuite(suite, depth + '  ')
  );
}

setTimeout(() => {
  rootSuites.forEach(suite =>
    executeSuite(suite)
  );
});

require('./assignment.spec');
