import path from 'path'
import { defineConfig } from 'vite'
import * as pkg from './package.json'
import dts from 'vite-plugin-dts'

const NODE_ENV = process.argv.mode || 'development';
const VERSION = pkg.version;

export default defineConfig({
    build: {
        copyPublicDir: false,
        lib: {
            entry: path.resolve(__dirname, 'src', 'block-shortcuts.ts'),
            name: 'BlockShortcut',
            fileName: 'block-shortcut',
        },
    },
    define: {
        'NODE_ENV': JSON.stringify(NODE_ENV),
        'VERSION': JSON.stringify(VERSION),
    },

    server: {
        open: './example/index.html',
        port: 3303,
    },
    plugins: [
        dts({
            entryRoot: 'src',
            outDir: 'dist',
        })
    ]
})
