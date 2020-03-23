const Bundler = require('parcel-bundler');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const files = fs.readdirSync('./demo');

// 2.数组格式
const entryFiles = files.map(dirname => path.join(__dirname, './demo/' + dirname + '/index.html'));

console.log(process.env.DEV);

child_process.exec(`npm run build-demo -- [${entryFiles.join(',')}]`);

// Bundler 选项
const options = {
  outDir: './dist',
  outFile: 'index.html',
  publicUrl: './',
  watch: !!process.env.DEV,
  cache: true,
  cacheDir: '.cache',
  contentHash: true,
  minify: false,
  scopeHoist: false,
  target: 'browser',
  bundleNodeModules: false,
  logLevel: 3,
  hmr: true,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: '',
  detailedReport: false
};

(async function() {
  // 使用提供的入口文件路径和选项初始化 bundler
  const bundler = new Bundler(entryFiles, options);

  // 运行 bundler，这将返回主 bundle
  // 如果你正在使用监听模式，请使用下面这些事件，这是因为该 promise 只会触发一次，而不是每次重新构建时都触发
  const bundle = await bundler.bundle();
})();
