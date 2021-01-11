import babel from 'rollup-plugin-babel'
import size from 'rollup-plugin-size'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import externalDeps from 'rollup-plugin-peer-deps-external'
import visualizer from 'rollup-plugin-visualizer'
import replace from '@rollup/plugin-replace'

const external = ['vue']

const globals = {
  vue: 'Vue',
}

const inputSrc = 'src/index.ts'

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
const babelConfig = { extensions, runtimeHelpers: true }
const resolveConfig = { extensions }

export default [
  {
    input: inputSrc,
    output: {
      file: 'dist/vue-query.mjs',
      format: 'es',
      sourcemap: true,
    },
    external,
    plugins: [
      resolve(resolveConfig),
      babel(babelConfig),
      commonJS(),
      externalDeps(),
    ],
  },
  {
    input: inputSrc,
    output: {
      file: 'dist/vue-query.min.mjs',
      format: 'es',
      sourcemap: true,
    },
    external,
    plugins: [
      resolve(resolveConfig),
      babel(babelConfig),
      commonJS(),
      externalDeps(),
      terser(),
    ],
  },
  {
    input: inputSrc,
    output: {
      name: 'VueQuery',
      file: 'dist/vue-query.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [
      resolve(resolveConfig),
      babel(babelConfig),
      commonJS(),
      externalDeps(),
    ],
  },
  {
    input: inputSrc,
    output: {
      name: 'VueQuery',
      file: 'dist/vue-query.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [
      replace({ 'process.env.NODE_ENV': `"production"`, delimiters: ['', ''] }),
      resolve(resolveConfig),
      babel(babelConfig),
      commonJS(),
      externalDeps(),
      terser(),
      size(),
      visualizer({
        filename: 'stats-vue.json',
        json: true,
      }),
    ],
  },
]
