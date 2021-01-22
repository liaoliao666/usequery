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

const inputSrcs = [
  ['src/index.ts', 'VuQuery', 'vu-query'],
  ['src/core/index.ts', 'VuQueryCore', 'vu-query-core'],
  ['src/hydration/index.ts', 'VuQueryHydration', 'vu-query-hydration'],
  [
    'src/persist-localstorage-experimental/index.ts',
    'VuQueryPersistLocalStorageExperimental',
    'persist-localstorage-experimental',
  ],
]

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
const babelConfig = { extensions, runtimeHelpers: true }
const resolveConfig = { extensions }

export default inputSrcs
  .map(([input, name, file]) => {
    return [
      {
        input: input,
        output: {
          name,
          file: `dist/${file}.development.js`,
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
        input: input,
        output: {
          name,
          file: `dist/${file}.production.min.js`,
          format: 'umd',
          sourcemap: true,
          globals,
        },
        external,
        plugins: [
          replace({
            'process.env.NODE_ENV': `"production"`,
            delimiters: ['', ''],
          }),
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
  })
  .flat()
