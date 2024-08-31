// Plugins
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss'; // Для обробки CSS
import copy from 'rollup-plugin-copy'; // Для копіювання файлів
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import url from 'postcss-url';


// Конфігурація
const configs = {
    name: 'BuildToolsCookbook',
    // files: ['main.js', 'detects.js', 'another-file.js'],
    files: ['main.js'],
    pathIn: 'src/js',
    pathOut: 'dist/js',
    minify: true,
    sourceMap: false
};

// Банер
const banner = `/*! ${configs.name ? configs.name : pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} ${pkg.author.name} | ${pkg.license} License | ${pkg.repository.url} */`;

// Функція для створення виходу
// Функція для створення виходу (залишаємо тільки js формат)
const createOutput = (filename, minify) => {
    const output = {
        file: `${configs.pathOut}/${filename}${minify ? '.min' : ''}.js`,
        format: 'es',
        banner: banner,
        sourcemap: configs.sourceMap
    };

    if (minify) {
        output.plugins = [terser()];
    }

    return output;
};

// Функція для створення всіх виходів
const createOutputs = (filename) => {
    const outputs = [createOutput(filename)];

    if (!configs.minify) return outputs;

    const outputsMin = createOutput(filename, true);

    return outputs.concat(outputsMin);
};

// Експорт конфігурацій
const createExport = () => {
    return configs.files.map(file => {
        const filename = file.replace('.js', '');
        return {
            input: `${configs.pathIn}/${file}`,
            output: createOutputs(filename),
            plugins: [
                replace({
                    preventAssignment: true,
                    '../img/': './img/'  // Заміна шляхів до зображень
                }),
                resolve(), // Розв'язування пакетів node_modules
                commonjs(), // Перетворення CommonJS модулів в ES6
                postcss({
                    extract: 'main.css',
                    plugins: [
                        url({
                            url: 'rebase', // Переносить ресурси відносно нового місця
                            assetsPath: 'dist/img', // Вказує новий шлях до зображень
                        }),
                    ]
                }), // Витягування CSS
            ]
        };
    });
};

export default createExport();
