// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/', // or '/YOUR_REPOSITORY_NAME/'
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                article_page: resolve(__dirname, 'article-page.html'),
                project_landing: resolve(__dirname, 'project-landing.html'),
                table_of_contents: resolve(__dirname, 'table-of-contents.html'),
            },
        },
    },
});