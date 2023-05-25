from fontTools import subset
from fontTools.subset import Subsetter, parse_unicodes

def subset_font(settings):
  options = subset.Options()
  options.flavor = 'woff2'
  options.ignore_missing_glyphs = True
  options.ignore_missing_unicodes = True
  options.desubroutinize = settings['desubroutinize']
  options.hinting = not settings['no-hinting']

  font = subset.load_font('./input-file', options)

  subsetter = Subsetter(options=options)

  if (('text' in settings) or ('unicodes' in settings)):
    subsetter.populate(
      unicodes=(parse_unicodes(settings['unicodes']) if ('unicodes' in settings) else []),
      text=settings['text'] if 'text' in settings else ''
    )
    subsetter.subset(font)

  subset.save_font(font, './output-file', options)

subset_font