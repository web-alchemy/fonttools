# Font tools

This is the Node.js adapter of [python font tools](https://github.com/fonttools/fonttools) via [Pyodide](https://pyodide.org) without having to install python and its dependencies.

Font tools library usually used for optimizing fonts – subseting, format converting, deleting of unused variable font axes, etc.

## Using as a CLI

You can install the library as a global dependency:

```shell
npm install --global @web-alchemy/fonttools
```

After installing [font utilities](https://fonttools.readthedocs.io/en/latest/#utilities) will be available globally:

```shell
fonttools <params>
pyftsubset <params>
pyftmerge <params>
ttx <params>
```

Also you can use this tool via [npx](https://docs.npmjs.com/cli/commands/npx):

```shell
npx -p @web-alchemy/fonttools <params>
npx -p @web-alchemy/fonttools pyftsubset <params>
npx -p @web-alchemy/fonttools pyftmerge <params>
npx -p @web-alchemy/fonttools ttx <params>
```

Example of converting `ttf` to `woff2`:

```shell
npx -p @web-alchemy/fonttools pyftsubset \
  "./some/path/to/font.ttf" \
  "*" \  # keep all glyphs and just convert format
  --output-file="./some/path/to/font.woff2" \
  --flavor="woff2"
```

Example of converting `ttf` to `woff2` and subseting with text and unicodes options:

```shell
npx -p @web-alchemy/fonttools pyftsubset \
  "./some/path/to/font.ttf" \
  --output-file="./some/path/to/font.woff2" \
  --flavor="woff2" \
  --text="The text whose characters will be included in the font file" \
  --unicodes="U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" \
  --desubroutinize \
  --no-hinting \
  --layout-features="*"
```

Example of [customizing variable font's axes](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html):

```shell
npx @web-alchemy/fonttools varLib.instancer \
  "./src/font.woff2" \
  # decrease `wght` axis range
  wght=400:600 \
  # delete `wdth` axis
  wdth=drop \ 
  --output="./dist/font.woff2"
```

## Using as a module

Library provides few JavaScript specific methods:

```javascript
const {
  subset,
  instantiateVariableFont,
  ttx
} = require('@web-alchemy/fonttools')
```

Example of converting `ttf` to `woff2`:

```javascript
const fs = require('node:fs')
const { subset } = require('@web-alchemy/fonttools')

async function main() {
  const inputFileBuffer = await fs.promises.readFile('./font.ttf')

  const outputFileBuffer = await subset(inputFileBuffer, {
    '*': true, // keep all glyphs and just convert format
    'flavor': 'woff2',
  })

  await fs.promises.writeFile('./font.woff2', outputFileBuffer)
}

main()
```

Example of converting `ttf` to `woff2` and subseting with text and unicodes options:

```javascript
const fs = require('node:fs')
const { subset } = require('@web-alchemy/fonttools')

async function main() {
  const inputFileBuffer = await fs.promises.readFile('./font.ttf')

  const outputFileBuffer = await subset(inputFileBuffer, {
    'text': "The text whose characters will be included in the font file",
    'unicodes': "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    'flavor': 'woff2',
  })

  await fs.promises.writeFile('./font.woff2', outputFileBuffer)
}

main()
```

Method `subset` takes same params as [original `pyftsubset` utility](https://fonttools.readthedocs.io/en/latest/subset/index.html)(without dashes `--`).

Example of [customizing variable font's axes](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html):

```javascript
const fs = require('node:fs')
const { instantiateVariableFont } = require('@web-alchemy/fonttools')

async function main() {
  const inputFileBuffer = await fs.promises.readFile('./src/font.woff2')

  const outputFileBuffer = await instantiateVariableFont(inputFileBuffer, {
    wght: [300, 500], // decrease `wght` axis range
    wdth: null // delete `wdth` axis
  })

  await fs.promises.writeFile('dist/font.woff2', outputFileBuffer)
}

main()
```

This is port of [method `varLib.instancer.instantiateVariableFont`](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html#fontTools.varLib.instancer.instantiateVariableFont)

Method `ttx` can convert binary font files (.otf, .ttf, etc) to the TTX XML format and convert them back to binary format.

Example of converting binary files to xml:

```javascript
const fs = require('node:fs');
const { ttx } = require('@web-alchemy/fonttools');

(async () => {
  const outputTtxBuffer = await ttx('./font.ttf'); // also accept `URL` and `Buffer`
  await fs.promises.writeFile('./font.ttx', outputTtxBuffer);
  
  const outputOtxBuffer = await ttx('./font.otf');
  await fs.promises.writeFile('./font.otx', outputOtxBuffer);
})();
```

Example of converting xml files to binary files:

```javascript
const fs = require('node:fs');
const { ttx } = require('@web-alchemy/fonttools');

(async () => {
  const ttxBuffer = await ttx('./font.ttx');
  await fs.promises.writeFile('./font.ttf', ttxBuffer);
  
  const otxBuffer = await ttx('./font.otx');
  await fs.promises.writeFile('./font.otf', otxBuffer);
})();
```

Example of converting xml files to binary files with encoding to `woff2`:

```javascript
const fs = require('node:fs');
const { ttx } = require('@web-alchemy/fonttools');

(async () => {
  const ttxBuffer = await ttx('./font.ttx', [
    ['--flavor', 'woff2']
  ]);
  await fs.promises.writeFile('./font.ttf', ttxBuffer);
  
  const otxBuffer = await ttx('./font.otx', [
    ['--flavor', 'woff2']
  ]);
  await fs.promises.writeFile('./font.otf', otxBuffer);
})();
```

## Limitations

- Doesn't support [zopfli](https://pypi.org/project/zopfli/) package for better optimizing woff files.
- In CLI all file paths should be relative to `cwd` (current working directory).

## References

- Python font tools. [Github](https://github.com/fonttools/fonttools), [Site](https://fonttools.readthedocs.io/en/latest/).
- Pyodide. [Github](https://github.com/pyodide), [Site](https://pyodide.org).