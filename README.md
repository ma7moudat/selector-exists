# Welcome to selector-exists 👋
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/ma7moudat/selector-exists#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/ma7moudat/selector-exists/graphs/commit-activity)
[![License: MIT License](https://img.shields.io/github/license/ma7moudat/selector-exists)](https://github.com/ma7moudat/selector-exists/blob/master/LICENSE)

> A node utility to check HTML markup for the existence of CSS selectors.

## Installation

```sh
# local installation as a dependency
npm install selector-exists

# global installation
npm install -g selector-exists

# direct usage with npx
npx selector-exsits
```

## CLI Usage

Running with the help option returns the following options: 

```sh
selector-exists --help

Options:
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -h, --html         HTML markup                                        [string]
  -p, --html-paths   Path(s) to files containing HTML markup            [string]
  -u, --html-url     URL to page to check                               [string]
  -c, --css          CSS string                                         [string]
  -f, --css-files    Path(s) to css files                               [string]
  -r, --css-url      URL to css file                                    [string]
  -s, --selectors    Comma separated list of selectors to check         [string]
      --hide-used    Hide used selectors              [boolean] [default: false]
      --hide-unused  Hide unused selectors            [boolean] [default: false]
      --json         Output as JSON object instead of a table
                                                      [boolean] [default: false]
```

Simple example:

```sh
selector-exists --html "<div class="box"><span></span></div>" --selectors ".box, .box span, img"

# would log the following table
┌─────────┬───────────────────┬────────────────┬─────────────┬───────┐
│ (index) │   identifierCss   │ identifierHtml │  selector   │ used  │
├─────────┼───────────────────┼────────────────┼─────────────┼───────┤
│    0    │ 'STDIN-SELECTORS' │    'STDIN'     │   '.box'    │ true  │
│    1    │ 'STDIN-SELECTORS' │    'STDIN'     │ '.box span' │ true  │
│    2    │ 'STDIN-SELECTORS' │    'STDIN'     │    'img'    │ false │
└─────────┴───────────────────┴────────────────┴─────────────┴───────┘
```

Multiple options:

```sh
selector-exists \
--html "<div class="box"><span></span></div>" \
--html-paths "./demos/**/*.html" \
--html-url "http://example.com" \
--css "div { background: cyan; } section { color: red }" \
--css-files "./demos/**/*.css" \
--css-url "http://example.com/style.css" \
--selectors ".box, .box span, img" \
--json \
--hide-used
```

## Code Usage

```javascript
import {ReaderStdin, ReaderFilesystem, ReaderUrl, SelectorExists} from 'selector-exists';

// create instance
const instance = new SelectorExists();

// add CSS sources
instance.addCssSource(new ReaderStdin('div { background: cyan; } section { color: red }'));
instance.addCssSource(new ReaderFilesystem('./demos/**/*.css'));
instance.addCssSource(new ReaderUrl('http://example.com/style.css'));

// add HTML sources
instance.addHtmlSource(new ReaderStdin('<div class="box"><span></span></div>'));
instance.addHtmlSource(new ReaderFilesystem('./demos/**/*.html'));
instance.addHtmlSource(new ReaderUrl('http://example.com'));

instance
    .processUsages()
    .then(() => {
        // logs into the console
        instance.report({
          json: true,
          used: false,
          unused: true,
        });
        
        // in code, better use
        instance.getUsages();
        // returns an array of usages matching the following interface
        //
        // interface IUsage {
        //   identifierCss: string;
        //   identifierHtml: string;
        //   selector: string;
        //   used: boolean;
        // }
    });
```

## Run tests

```sh
npm run test
```

## Author

👤 Mahmoud Aldaas <[@ma7moudat](https://github.com/ma7moudat)>

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/ma7moudat/selector-exists/issues). 

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

This project is [MIT License](https://github.com/ma7moudat/selector-exists/blob/master/LICENSE) licensed.

