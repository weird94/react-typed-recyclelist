import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';

const outputs = [
  {
    file: 'dist/index.cjs.js',
    format: 'cjs'
  },
  {
    file: 'dist/index.esm.js',
    format: 'esm'
  }
];

export default outputs.map(output => ({
  input: 'src/index.ts',
  output: output,
  plugins: [
    typescript(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
}));
