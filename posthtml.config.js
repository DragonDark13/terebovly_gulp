const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlReplace = require('posthtml-replace');

// Читання HTML файлу
const html = fs.readFileSync('./src/copy/index.html', 'utf8');

// Налаштування плагіну для заміни
const replacePlugin = posthtmlReplace([
  {
    match: {
      tag: 'img'
    },
    attrs: {
      src: {
        from: '../img/',
        to: './img/'
      }
    }
  },
  {
    match: {
      tag: 'link'
    },
    attrs: {
      href: {
        from: '../img/',
        to: './img/'
      }
    }
  },
]);

// Обробка HTML з плагіном
posthtml()
  .use(replacePlugin)
  .process(html)
  .then(result => {
    fs.writeFileSync('./dist/index.html', result.html);
    console.log('HTML file processed and saved to ./dist/index.html');
  })
  .catch(error => {
    console.error('Error processing HTML:', error);
  });