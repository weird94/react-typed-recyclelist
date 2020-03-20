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
  /**
   * 5 = 储存每个信息
   * 4 = 输出信息、警告和错误附加时间戳和dev服务的http请求
   * 3 = 输出信息、警告和错误
   * 2 = 输出警告和错误
   * 1 = 输出错误
   */
  hmr: true, // 开启或禁止HRM
  hmrPort: 0, // hmr socket 运行的端口，默认为随机空闲端口(在 Node.js 中，0 会被解析为随机空闲端口)
  sourceMaps: true, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
  hmrHostname: '', // 热模块重载的主机名，默认为 ''
  detailedReport: false // 打印 bundles、资源、文件大小和使用时间的详细报告，默认为 false，只有在禁用监听状态时才打印报告
};

(async function() {
  // 使用提供的入口文件路径和选项初始化 bundler
  const bundler = new Bundler(entryFiles, options);

  // 运行 bundler，这将返回主 bundle
  // 如果你正在使用监听模式，请使用下面这些事件，这是因为该 promise 只会触发一次，而不是每次重新构建时都触发
  const bundle = await bundler.bundle();
})();
