import Unfonts from 'unplugin-fonts/vite'
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [
        Unfonts({
            google: {
                preconnect: true,
                families: ['Roboto'],
                display: 'block',
            },
        }),
    ],
})
