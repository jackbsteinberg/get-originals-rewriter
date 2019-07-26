jest.autoMockOff();
const defineTest = require('jscodeshift/src/testUtils').defineTest;
const runUnitTest = require('../testrunner.js');

// test removing all console instances
defineTest(__dirname, 'rewriter', undefined, 'remove-console-all');

// test removing all console instances
defineTest(__dirname, 'rewriter', undefined, 'test-other');

// test removing console statements
runUnitTest(__dirname, '/mods/clean-console-statements',
    'mods/statements/remove-console-statements');

// test removing console expressions
runUnitTest(__dirname, '/mods/clean-console-expressions',
    'mods/expressions/remove-console-expressions');
