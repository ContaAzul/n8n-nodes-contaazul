const path = require('path');
const { task, src, dest, parallel } = require('gulp');

task('build:icons', parallel(copyNodeAssetIcons, copyRootNodeIcons, copyIconsFolder));

function copyNodeAssetIcons() {
  const nodeSource = path.resolve('nodes/assets/contaazul.svg');
  const nodeDestination = path.resolve('dist/nodes/ContaAzul/assets');

  return src(nodeSource).pipe(dest(nodeDestination));
}

function copyRootNodeIcons() {
  const nodeSource = path.resolve('nodes/ContaAzul/contaazul.svg');
  const nodeDestination = path.resolve('dist/nodes/ContaAzul');

  return src(nodeSource).pipe(dest(nodeDestination));
}

function copyIconsFolder() {
  const iconSource = path.resolve('icons/**/*.svg');
  const iconDestination = path.resolve('dist/icons');

  return src(iconSource).pipe(dest(iconDestination));
}
