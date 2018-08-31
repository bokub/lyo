# Lyo

> Node.js to browser. The easy way

Lyo is the easiest way to publish Node.js modules as browser-compatible libraries.

No decision-making, no configuration needed, it just works!

Lyo uses Browserify, Babel, UglifyJS, and a pinch of magic ✨ so you don't have to worry about configuring them.

## Install & Run

```sh
# Install globally
npm i -g lyo

# Run
lyo
```

## Options

```sh
$ lyo --help

    Usage
      $ lyo [options]       Run Lyo
      $ lyo init [options]  Add Lyo to your project

    Options
      --input    -i  Entry file
      --output   -o  Output file / folder
      --name     -n  Module name in browser
      --usage    -u  Show how to use the output file 

    Examples
      $ lyo
      $ lyo --usage
      $ lyo -i main.js
      $ lyo -n runMyFunction
      $ lyo -o dist/bundle.min.js
```


## Recommended workflow

Once you've tried Lyo on your module and figured the good options to use, you should consider
the following steps

### 1. Add Lyo to your project

Run `lyo init` (with options) will edit your `package.json` as follows:

- Lyo will be added to the dev dependencies
- A pre-publish script will be created (or edited) so Lyo is triggered before every `npm publish`
- If you provide options, they will be saved as default options (you can change/remove them later)

```sh 
$ lyo init -i lib/main.js -n runMyModule
```
```json
{
    "name": "my-module",
    "devDependencies": {
        "lyo": "latest"
    },
    "scripts": {
        "prepublishOnly": "lyo"
    },
    "lyo": {
        "input": "lib/main.js",
        "name": "runMyModule"
    }
}
```

Don't forget to run `npm install` after that

### 2. Add documentation

Use Lyo with the `--usage` option to show an example code snippet. You can edit and include it in your `README.md`.
Don't forget to check that the version is correct, or replace it with `latest`

```sh 
$ lyo --usage
> ...
> Lyo finished successfully!
```
```html
<!-- local usage -->
<script src="dist/my-module.min.js"></script>
<!-- CDN usage -->
<script src="https://cdn.jsdelivr.net/npm/my-module@1.0.0/dist/my-module.min.js"></script>

<script>
  myModule()
</script>
```

### 3. Commit and publish

Lyo will output a single file, by default in a `dist` folder. You can choose to commit it, or not. It's really up to you.

Run `npm publish`, Lyo will compile your package, and the output will be pushed to the npm registry with the rest of your module.
Congratulations, you're done! 💪


## License

MIT © [Boris K](https://github.com/bokub)


## About

- Lyo's philosophy is highly inspired from [xo](https://github.com/xojs/xo), a linter that works immediately, without any
configuration
 
- Lyo's name comes from [lyophilization](https://en.wiktionary.org/wiki/lyophilization), a process that transforms food
into a compact shape.