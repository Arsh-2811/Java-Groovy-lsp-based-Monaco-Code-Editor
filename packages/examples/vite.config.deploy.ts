import { defineConfig } from 'vite';
import { buildBaseProductionConfig } from './vite.production.base.js';

export default defineConfig(({ command }) => {
    console.log(`Running: ${command}`);
    const productionConfig = buildBaseProductionConfig();
    productionConfig.base = 'https://typefox.github.io/monaco-languageclient/';
    return productionConfig;
});

