# Guia de Publicação no npm

Este documento explica como publicar o node ContaAzul no npm.

## Pré-requisitos

1. **Conta no npm**: Crie uma conta em https://www.npmjs.com/signup
2. **Login no npm**: Execute `npm login` no terminal
3. **Nome único**: Verifique se o nome `n8n-nodes-contaazul` está disponível

## Passo a Passo

### 1. Preparar o código

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Fazer build do projeto
npm run build

# Verificar se o pacote está pronto
npm run test:package
```

### 2. Verificar versão

Edite o `package.json` e atualize a versão seguindo [versionamento semântico](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

Exemplo: `"version": "0.1.1"`

### 3. Commit e push

```bash
git add .
git commit -m "v0.1.1: descrição das mudanças"
git push origin main
```

### 4. Publicar no npm

```bash
# Publicar (primeira vez)
npm publish --access public

# Para atualizações futuras
npm publish
```

## Verificação pós-publicação

1. Acesse https://www.npmjs.com/package/n8n-nodes-contaazul
2. Verifique se todos os arquivos estão incluídos
3. Teste a instalação: `npm install n8n-nodes-contaazul`

## Troubleshooting

### Erro: "You must be logged in to publish packages"
```bash
npm login
```

### Erro: "Package name already exists"
- Escolha outro nome no `package.json`
- Ou use um escopo: `@seuusuario/n8n-nodes-contaazul`

### Erro: "Access denied"
- Verifique se está logado com a conta correta
- Use `npm whoami` para verificar

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