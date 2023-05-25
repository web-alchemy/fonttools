# Tool for font subseting

Tool uses [Pyodide](https://pyodide.org) and [Font Tools](github.com/fonttools/fonttools) and support small options set of original [font tools subset CLI](https://fonttools.readthedocs.io/en/latest/subset/index.html).

## Usage examples

Just converting `ttf` to `woff2`:

```shell
npx @web-alchemy/fonttools subset \
  --input-file="/some/path/to/font.ttf" \
  --flavor="woff2" \
```

Converting `ttf` to `woff2` and subseting with text and unicodes options

```shell
npx @web-alchemy/fonttools subset \
  --input-file="/some/path/to/font.ttf" \
  --output-file="/some/path/to/font.woff2" \
  --flavor="woff2" \
  --text="The text whose characters will be included in the font file" \
  --uncodes="U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" 
  --desubroutinize \
  --no-hinting \
  --layout-features="*"
```

## Good articles about font subseting

- https://calendar.perfplanet.com/2017/3-tips-for-faster-font-loading
- https://markoskon.com/creating-font-subsets
- https://www.zachleat.com/web/css-tricks-web-fonts
- https://cloudfour.com/thinks/font-subsetting-strategies-content-based-vs-alphabetical

## Another useful tools

- [glyphhanger](https://github.com/zachleat/glyphhanger). [Article](https://www.zachleat.com/web/glyphhanger)

## Same tools

- [subset-font](https://github.com/papandreou/subset-font)
- [foliojs fontkit](https://github.com/foliojs/fontkit). At that moment for PDF only.

## Online services for font subseting
- https://transfonter.org

## Service for getting information about fonts
- https://wakamaifondue.com
- https://fontdrop.info
 
## Sites with unicode data

- https://www.unicode.org/charts
- https://jrgraphix.net/r/Unicode
