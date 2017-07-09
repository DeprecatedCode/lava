const path = require('path');
const fs = require('fs');

const isDir = filePath => {
  try {
    return fs.statSync(filePath).isDirectory();
  }
  catch (e) {
    return false;
  }
};

let filePath = process.argv[2];

if (!filePath) {
  filePath = 'index.lava';
}

if (isDir(filePath)) {
  filePath = path.join(filePath, 'index.lava');
}

if (!filePath.endsWith('.lava')) {
  filePath = `${filePath}.lava`;
}

const code = fs.readFileSync(filePath, 'utf8');

const lava = require('./lava');

lava(code)();