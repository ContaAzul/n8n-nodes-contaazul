# Guia de Publicação no npm

Este documento explica o processo de publicação do node ContaAzul no npm.

## Processo de Publicação

A publicação deste pacote no npm é realizada **exclusivamente através da esteira de produção**.

## Versionamento

O versionamento segue o padrão [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções de bugs compatíveis

A versão é gerenciada automaticamente pela esteira através dos commits convencionais.

## Fluxo de Deploy

1. **Desenvolvimento**: Desenvolva e teste localmente

   ```bash
   npm install
   npm test
   npm run build
   npm run test:package
   ```

2. **Commit**: Use commits convencionais para controle de versão

   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   # ou
   git commit -m "fix: correção de bug"
   ```

3. **Push**: Envie para o repositório

   ```bash
   git push origin main
   ```

4. **Deploy Automático**: A esteira de produção irá:
   - Executar testes
   - Fazer build do projeto
   - Atualizar a versão automaticamente
   - Publicar no npm registry

## Verificação pós-publicação

1. Acesse https://www.npmjs.com/package/@contaazul/n8n-nodes-contaazul
2. Verifique se a versão foi publicada corretamente
3. Monitore os logs da esteira para confirmar sucesso

## Estrutura do pacote publicado

```
n8n-nodes-contaazul/
├── dist/
│   ├── nodes/
│   │   └── ContaAzul/
│   │       ├── ContaAzul.node.js
│   │       └── assets/
│   │           └── contaazul.svg
│   └── credentials/
│       └── ContaAzulOAuth2Api.credentials.js
├── index.js
├── index.d.ts
├── package.json
└── README.md
```

## Notas importantes

- O campo `files` no `package.json` controla o que será publicado
- O `.npmignore` exclui arquivos desnecessários
- Sempre teste localmente antes de publicar
- Mantenha o README.md atualizado
