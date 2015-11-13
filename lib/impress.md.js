
"use strict"

var jade = require('jade');
var marked = require('marked');
var highlight = require('highlight.js');
var fs = require('fs');
var path = require('path');
var js_files = [ 'js/impress.js', 'js/slides.js' ];
var css_files = [ 'css/impress.css', 
    'node_modules/highlight.js/styles/solarized_light.css', 
    'css/slides.css' ];
var module_path = path.dirname(__dirname);
var UglifyJs = require('uglify-js');
var CleanCss = require('clean-css');
var Promise = require('bluebird');

function resolve_path(path) {
  return module_path + '/' + path;
}

js_files = js_files.map(function(file) {
  return resolve_path(file);
});

css_files = css_files.map(function(file) {
  return resolve_path(file);
});

var attr_pattern = /(.*\S)\s*<a href="([^"]*)">\s*<\/a>\s*/;
var attr_item_pattern = /([^=,\s]+)\s*=\s*([^=,\s]+)/;
var html_template_file = resolve_path('templates/slides.jade');
var html_jade = jade.compileFile(html_template_file);

module.exports = function(file) {

  var renderer = new marked.Renderer();
  var is_open = false;
  var title = 'Slide Title'
  var steps = 0;
  var cleanCss = new CleanCss();

  renderer.heading = function (text, level) {
    var html = '';
    var h = 'h'+level;
    var match, attrs;
    if(level > 2) {
      return '<'+h+'>'+text+'</'+h+'>';
    }
    if(is_open === true) {
      html += '</div>';
    }
    steps += 1;
    match = attr_pattern.exec(text);
    attrs = {'class': "step slide"};
    if(match) {
      text = match[1];
      while(match = attr_item_pattern.exec(match[2])) {
        var key = match[1];
        var value = match[2];
        if(key == 'class') {
          attrs['class'] += ' '+value
        } else {
          attrs['data-'+key] = value;
        }
      }
    }
    if(level == 1) {
      attrs['class'] += ' screen'
      title = text;
    }
    if(!attrs['data-x']) {
      attrs['data-x'] = (steps-5) * 1000;
    }
    var attr_list = [];
    for(var k in attrs) {
      if(attrs.hasOwnProperty(k)) {
        attr_list.push(k+'="'+attrs[k]+'"');
      }
    }
    html += '<div '+attr_list.join(' ')+'>';
    is_open = true;
    html += '<'+h+'>'+text+'</'+h+'>';
    return html;
  }

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: function (code, lang) {
      return highlight.highlightAuto(code, [lang]).value;
    }
  })

  if(is_open) {
    marked += '</div>'
  }

  var js = js_files.map(function(file) {
    return UglifyJs.minify(file).code
  }).join(";");

  var md = fs.readFileSync(file).toString();
  var marked_html = marked(md);

  return Promise.all(css_files.map(function(file) {
    return new Promise(function(resolve, reject) {
      cleanCss.minify(fs.readFileSync(file), function(err, css) {
        if(err) return reject(err);
        return resolve(css.styles);
      });
    });
  })).then(function(css_list) {

    return html_jade({
      js: js,
      css: css_list.join("\n"),
      title: title,
      marked: marked_html
    })

  });

}
