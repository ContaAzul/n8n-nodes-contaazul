#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando se o pacote está pronto para publicação...\n');

// Verificar se a pasta dist existe
if (!fs.existsSync('dist')) {
  console.error('❌ Pasta dist não encontrada. Execute "npm run build" primeiro.');
  process.exit(1);
}

// Verificar se os arquivos principais existem
const requiredFiles = [
  'dist/nodes/ContaAzul/ContaAzul.node.js',
  'dist/credentials/ContaAzulOAuth2Api.credentials.js',
  'index.js',
  'index.d.ts'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
    allFilesExist = false;
  }
});

// Verificar se os ícones foram copiados
const iconFiles = [
  'dist/nodes/ContaAzul/assets/contaazul.svg'
];

console.log('\n📁 Verificando ícones:');
iconFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 Pacote está pronto para publicação!');
  console.log('Execute: npm publish --access public');
} else {
  console.log('\n❌ Pacote não está pronto. Corrija os problemas acima.');
  process.exit(1);
} 