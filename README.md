[![Lyo](https://i.imgur.com/nt5bYNJ.png)](https://github.com/bokub/lyo/issues/1)

> Node.js to browser - The easy way

[![Npm version](https://runkit.io/bokub/npm-version/branches/master/lyo)](https://npmjs.com/package/lyo)
[![Build status](https://badgen.net/travis/bokub/lyo)](https://travis-ci.org/bokub/lyo)
[![Code coverage](https://badgen.net/codecov/c/github/bokub/lyo)](https://codecov.io/gh/bokub/lyo)
[![XO code style](https://badgen.net/badge/code%20style/XO/5ed9c7)](https://github.com/xojs/xo)

Lyo is the easiest way to transform Node.js modules into browser-compatible libraries.

No decision-making, no configuration needed, it just works!

Lyo uses [Browserify][browserify], [Babel][babel], [UglifyJS][uglify], and a pinch of magic ✨ so you don't have to
worry about configuration

## Install & Run

```sh
# Install globally
npm i -g lyo

# Run (on your own module)
lyo

# Run (on any npm module)
lyo get query-string
```

Lyo will create a single `.min.js` file that you can import in a `<script>` tag

```html
<script src="my-module.min.js"></script>
<script>
  myModule('foo');
</script>
```

## Options

Lyo is supposed to work right away, but you can force things with some options if needed.

```
$ lyo --help

    Usage
      $ lyo [options]               Run Lyo
      $ lyo init [options]          Add Lyo to your project
      $ lyo usage [options]         Show how to use the output file
      $ lyo get <module> [options]  Run Lyo on a module from npm

    Options
      --input   -i  Entry file
      --output  -o  Output file / folder
      --name    -n  Module name in browser
      --banner  -b  Add a banner to the top of the bundle

    Examples
      $ lyo
      $ lyo -i main.js
      $ lyo -n runFunction
      $ lyo get query-string
      $ lyo -o dist/bundle.min.js
      $ lyo -b 'Lyo\nLicensed under MIT'
```


## Recommended workflow

Once you've tried Lyo on your module and figured the best options to use, you should consider the following steps

### 1. Add Lyo to your project

Run `lyo init` (with options) to edit your `package.json` as follows:

- Lyo will be added to the dev dependencies
- A pre-publish script will be created (or edited) so Lyo is triggered before every `npm publish`
- If you provide options, **they will be saved as default options**

```sh
# Example with some random options
$ lyo init -i lib/main.js -n runMyModule
```
![package.json](https://i.imgur.com/yxBGqne.png)

Don't forget to run `npm install` after that

### 2. Add documentation

Run `lyo usage` (with options) to show an example code snippet. You can edit and include it in your `README.md`.

```
$ lyo usage

> Edit and include the following snippet in your README.md
```
![HTML example](https://i.imgur.com/xryNOT5.png)


### 3. Commit and publish

Lyo will output a single file called a _bundle_, by default in a `dist` folder. You can choose to commit it, or not.
It's really up to you.

Run `npm publish`, Lyo will compile your module, and the bundle will be pushed to the npm registry with the rest of your module.
Congratulations, you're done! 💪

### Additional tips

- Don't use the bundle in a Node.js environment. The bundle is supposed to run in browsers only
- Don't immediately blame Lyo if it fails to compile your code. The error could come from [Browserify][browserify],
 [Babel][babel] or [UglifyJS][uglify]


## Using Lyo on someone else's module

Sometimes, you stumble upon a npm module without a browser-compatible version.

No worries, just run `lyo get <module>` to download and compile it right away ⚡

```sh
# Compile query-string (npmjs.com/package/query-string)
$ lyo get query-string

# Compile a specific version of Joi (npmjs.com/package/joi)
$ lyo get joi@13.5.0 --name Joi
```

_____

## FAQ

#### What if I need unsupported features?

If you need features unsupported by Lyo (sourcemaps, code splitting...), your best option is not using Lyo, which is
nothing more than an all-in-one package, with automatic configuration.

However, if you think Lyo should support this feature, feel free to create a new
[issue](https://github.com/bokub/lyo/issues)!

#### Why Lyo when there are thousands of better tools doing the same thing?

Lyo's philosophy is highly inspired from [XO](https://github.com/xojs/xo), a linter that works immediately, without any
configuration. XO is just an ESLint wrapper, but it saves you the hassle of choosing ESLint rules, adding them to a
new `.eslintrc` file, installing plugins...

I use XO for almost all my projects, but I could not find any tool as simple as XO for Node.js > browser compilation.
That's why I created Lyo
 
#### What does Lyo mean?

Lyo is short for [lyophilization](https://en.wiktionary.org/wiki/lyophilization), a process that transforms food
into a dry and compact form


## License

MIT © [Boris K](https://github.com/bokub)

[browserify]: https://github.com/browserify/browserify
[babel]: https://github.com/babel/babel
[uglify]: https://github.com/mishoo/UglifyJS2
