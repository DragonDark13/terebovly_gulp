const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlReplace = require('posthtml-replace');

// Шлях до HTML файлу
const filePath = './dist/index.html';

// Читання HTML файлу
const originalHtml = fs.readFileSync(filePath, 'utf8');

// Налаштування плагіну для заміни
const replacePlugin = posthtmlReplace([
    {
        match: {
            tag: 'img'
        },
        attrs: {
            src: {
                from: '../svg/',
                to: './svg/'
            }
        }
    },
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
    .process(originalHtml)
    .then(result => {
        const processedHtml = result.html;

        // Порівняння вмісту
        if (originalHtml !== processedHtml) {
            // Якщо були зміни, перезаписуємо файл
            fs.writeFileSync(filePath, processedHtml);
            console.log('HTML file processed and saved to', filePath);
        } else {
            console.log('No changes detected, file not saved.');
        }
    })
    .catch(error => {
        console.error('Error processing HTML:', error);
    });
