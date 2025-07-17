const path = require('path');
const { task, src, dest } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
  const nodeSource = path.resolve('nodes/assets/contaazul.svg');
  const nodeDestination = path.resolve('dist/nodes/ContaAzul/assets');

  return src(nodeSource).pipe(dest(nodeDestination));
}
