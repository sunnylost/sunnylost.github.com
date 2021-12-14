import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import summary from 'rollup-plugin-summary'

export default {
    input: 'assets/elements/index.js',
    plugins: [
        resolve(),
        terser({
            ecma: 2020,
            module: true,
            warnings: true
        }),
        summary()
    ],
    output: {
        file: 'assets/elements/elements.bundle.js'
    },
    preserveEntrySignatures: 'strict'
}
