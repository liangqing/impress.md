impress.md
==========

Convert markdown file to [impress.js](https://github.com/impress/impress.js) slides

## Features
* support github flavored markdown, thanks [marked](https://github.com/chjj/marked)
* support highlight code by using [highlight.js](http://highlightjs.readthedocs.org/en/latest/index.html)
* all js/css are embed in html file, so one file is everything
* the syntax do not break original markdown presentation, it is compatible

## Install

```shell
npm install -g impress.md
```

## Write your slides in markdown

* level 1 header and leval 2 header construct a slide
* use '[](attr1=value, attr2=value2)' to set impress.js properties
* See the [example](), [markdown file]()

## Convert markdown to html

```bash
impress.md [markdown file] > slides.html
```

## API

```javascript

  var impress_md = require('impress.md');

  // first parameter is the path of markdown file
  // second parameter are options
  // return a Promise
  impress_md(markdown_file, {
    marked: { //a object, the options of marked
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    },
    highlight_style: 'solarized_dark', //the style of highlight
    js_files: [], // the js files will attached
    css_files:[], // the css files will attached
  })
    .then(function(html) {
      // target html
    }, function(err) {
      process.exit(2);
    });

```

## License

MIT License

