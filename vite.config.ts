import Unfonts from 'unplugin-fonts/vite'
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [
        Unfonts({
            google: {
                families: ['Roboto'],
                display: 'block',
            },
            custom: {
                families: [{
                    name: 'Material Icons',
                    local: 'Material Icons',
                    src: './src/assets/fonts/materialdesignicons-webfont.woff2',
                }],
                display: 'block',
                preload: true
            }
        }),
    ],
})
