#!/usr/bin/env node

// Dependencies
import yargs from 'yargs';
import { SelectorExists, ReaderStdin, ReaderFilesystem } from './index';

// Grab provided args
const argv = yargs(process.argv)
  .option('html', {
    alias: 'h',
    type: 'string',
    description: 'HTML markup',
  })
  .option('html-paths', {
    alias: 'p',
    type: 'string',
    description: 'Path(s) to files containing HTML markup',
  })
  .option('css', {
    alias: 'c',
    type: 'string',
    description: 'CSS string',
  })
  .option('css-files', {
    alias: 'f',
    type: 'string',
    description: 'Path(s) to css files',
  })
  .option('selectors', {
    alias: 's',
    type: 'string',
    description: 'Comma separated list of selectors to check',
  })
  .option('hide-used', {
    type: 'boolean',
    description: 'Hide used selectors',
    default: false,
  })
  .option('hide-unused', {
    type: 'boolean',
    description: 'Hide unused selectors',
    default: false,
  })
  .option('json', {
    type: 'boolean',
    description: 'Output as JSON object instead of a table',
    default: false,
  }).argv;

const instance = new SelectorExists();

if (argv.selectors) {
  instance.addCssSource(new ReaderStdin(`${argv.selectors} {}`).setIdentifier('STDIN-SELECTORS'));
}
if (argv.css) {
  instance.addCssSource(new ReaderStdin(argv.css));
}
if (argv['css-files']) {
  instance.addCssSource(new ReaderFilesystem(argv['css-files']));
}
if (argv.html) {
  instance.addHtmlSource(new ReaderStdin(argv.html));
}
if (argv['html-paths']) {
  instance.addHtmlSource(new ReaderFilesystem(argv['html-paths']));
}

instance.processUsages().then(() => {
  instance.report({
    json: argv.json,
    used: !argv['hide-used'],
    unused: !argv['hide-unused'],
  });
});
