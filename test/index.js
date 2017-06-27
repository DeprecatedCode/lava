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

Object.defineProperty(global.subject, 'now', {
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
    },
    throw: expected => {
      let error;

      try {
        value();
      }

      catch (e) {
        error = e;
      }

      if (!error) {
        throw new Error(`Expected an error to be thrown by ${value.toString()}`);
      }

      if (!expected.test(error.message)) {
        throw new Error(`Expected error message to match ${expected.toString()}, got \`${error.message}\``);
      }
    }
  };
  expectations.to = expectations;
  return expectations;
};

const executeSuite = (suite, depth = '') => {
  currentSuite = suite;
  let passingTests = 0;
  let failingTests = 0;
  let pendingOutput = [];
  suite.it.forEach((test) => {
    hasSubject = false;
    activeSubject = undefined;
    try {
      test.executor();
      passingTests++;
      pendingOutput.push(`${depth}  ✔ ${test.description}`);
    }
    catch (error) {
      failingTests++;
      pendingOutput.push(`${depth}  ✘ ${test.description}`);
      pendingOutput.push(error);
    }
  });

  if (passingTests === 0 && failingTests === 0) {
    console.log(`${depth}◼ ${suite.description}`);
  }

  else if (passingTests > 0 && failingTests === 0) {
    console.log(`${depth}✔ ${suite.description}`);
  }

  else if (failingTests > 0) {
    console.log(`${depth}✘ ${suite.description} - ${passingTests}/${passingTests + failingTests} passed`);
    pendingOutput.forEach(output => console.log(output));
  }

  suite.childSuites.forEach(suite =>
    executeSuite(suite, `${depth}  `)
  );
}

setTimeout(() => {
  rootSuites.forEach(suite =>
    executeSuite(suite)
  );
});

require('./assignment.spec');
require('./example.spec');
