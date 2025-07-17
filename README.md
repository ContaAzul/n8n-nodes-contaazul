# n8n-nodes-contaazul

Este é um node da comunidade n8n que permite integrar com a API da Conta Azul em seus workflows.

A Conta Azul é uma plataforma de gestão empresarial que oferece soluções para controle financeiro, vendas, produtos, serviços e gestão de clientes. Este node permite automatizar operações como busca de vendas, criação de produtos, gestão de clientes e consultas financeiras.

[n8n](https://n8n.io/) é uma plataforma de automação de workflows com [licença fair-code](https://docs.n8n.io/reference/license/).

[Instalação](#instalação)  
[Operações](#operações)  
[Credenciais](#credenciais)  
[Compatibilidade](#compatibilidade)  
[Uso](#uso)  
[Recursos](#recursos)  
[Histórico de versões](#histórico-de-versões)  

## Instalação

Siga o [guia de instalação](https://docs.n8n.io/integrations/community-nodes/installation/) na documentação de nodes da comunidade n8n.

## Operações

### Serviços
- **Buscar serviço por filtro**: Lista serviços com filtros de busca textual e paginação
- **Buscar serviço por ID**: Obtém detalhes de um serviço específico

### Vendas
- **Buscar venda por filtro**: Lista vendas com filtros de busca textual e paginação
- **Buscar venda por ID**: Obtém detalhes de uma venda específica
- **Criar venda**: Cria uma nova venda com itens, cliente e forma de pagamento

### Pessoas - Clientes/Fornecedores
- **Buscar pessoas por filtro**: Lista pessoas clientes/fornecedores com filtros de busca
- **Buscar pessoa por ID**: Obtém detalhes de uma pessoa específica
- **Criar pessoa**: Cria uma nova pessoa cliente/fornecedor

### Produtos
- **Buscar produtos por filtro**: Lista produtos com filtros de busca
- **Criar produto**: Cria um novo produto

### Financeiro
- **Buscar contas financeiras**: Lista todas as contas financeiras
- **Buscar receitas por filtro**: Lista receitas com filtros
- **Buscar despesas por filtro**: Lista despesas com filtros
- **Buscar parcela por ID**: Obtém detalhes de uma parcela específica
- **Buscar categorias**: Lista todas as categorias disponíveis
- **Buscar centros de custos**: Lista todos os centros de custo


## Credenciais

Para usar este node, você precisa de uma conta na Conta Azul e configurar as credenciais OAuth2.

### Pré-requisitos
1. Ter uma conta ativa na Conta Azul
2. Acessar o painel de desenvolvedores da Conta Azul
3. Criar um aplicativo para obter o Client ID e Client Secret

### Configuração das Credenciais
1. No n8n, vá para **Settings** > **Credentials**
2. Clique em **Add Credential**
3. Selecione **Conta Azul OAuth2 API**
4. Preencha os campos:
   - **Client ID**: Seu Client ID da Conta Azul
   - **Client Secret**: Seu Client Secret da Conta Azul
   - **Scope**: `openid profile aws.cognito.signin.user.admin` (padrão)
   - **Auth URL**: `https://auth.contaazul.com/oauth2/authorize` (padrão)
   - **Token URL**: `https://auth.contaazul.com/oauth2/token` (padrão)
5. Clique em **Save** e autorize o aplicativo

## Compatibilidade

- **Versão mínima do n8n**: 1.0.0
- **Versões testadas**: 1.0.0, 1.1.0, 1.2.0
- **Node.js**: >=20.15

## Uso

### Exemplo: Buscar Vendas Recentes
1. Adicione o node **Conta Azul** ao seu workflow
2. Configure as credenciais
3. Selecione a operação **Buscar venda por filtro**
4. Configure os parâmetros de busca (opcional)
5. Execute o workflow

### Exemplo: Criar uma Nova Venda
1. Adicione o node **Conta Azul** ao seu workflow
2. Configure as credenciais
3. Selecione a operação **Criar venda**
4. Preencha os dados obrigatórios:
   - ID do cliente
   - Forma de pagamento
   - Itens da venda
5. Execute o workflow

### Exemplo: Sincronizar Produtos
1. Use o node **Conta Azul** com operação **Buscar produtos por filtro**
2. Conecte com outros nodes para processar os dados
3. Use webhooks para sincronização automática

## Recursos

* [Documentação de nodes da comunidade n8n](https://docs.n8n.io/integrations/#community-nodes)
* [Documentação da API da Conta Azul](https://developers.contaazul.com/guide)
* [Painel de desenvolvedores da Conta Azul](https://developers-portal.contaazul.com)
* [Experimente o n8n](https://docs.n8n.io/try-it-out/)

## Histórico de versões

### v0.1.0
- Implementação inicial do node
- Suporte a operações básicas busca de serviços, vendas, pessoas, produtos, categorias, centros de custo e financeiro
- Integração com OAuth2 da Conta Azul
