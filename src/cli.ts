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
  .option('html-url', {
    alias: 'u',
    type: 'string',
    description: 'URL of page to check',
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
  .option('css-url', {
    alias: 'l',
    type: 'string',
    description: 'URL of stylesheet',
  })
  .option('selectors', {
    alias: 's',
    type: 'string',
    description: 'Comma separated list of selectors to check',
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  }).argv;

const instance = new SelectorExists();
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

instance.processUsages().then(() => instance.showReport());
