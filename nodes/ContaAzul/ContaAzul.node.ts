import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { getAllServices, getServiceById } from './servicos';
import { getProductsByFilter, createProduct } from './produtos';
import { getCategories } from './categorias';
import { getCostCenters } from './centroCusto';
import { getPersonsByFilter, getPersonById } from './pessoas';
import { getFinancialAccounts, getRevenuesByFilter, getExpensesByFilter, getInstallmentById } from './financeiro';
import { getSalesByFilter, getSaleById, createSale } from './vendas';
import { createPerson } from './pessoas';

export class ContaAzul implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'API Conta Azul',
		name: 'contaAzul',
		icon: 'file:contaazul.svg',
		group: ['transform'],
		version: 1,
		description: 'Permite fazer requisições à API da Conta Azul',
		defaults: {
			name: 'Conta Azul',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'contaAzulOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operação',
				name: 'operation',
				type: 'options',
				options: [
					{ name: 'Buscar serviço por filtro', value: 'getAllServices' },
					{ name: 'Buscar serviço por ID', value: 'getServiceById' },
					{ name: 'Buscar venda por filtro', value: 'getSalesByFilter' },
					{ name: 'Buscar venda por ID', value: 'getSaleById' },
					{ name: 'Buscar pessoas por filtro', value: 'getPersonsByFilter' },
					{ name: 'Buscar pessoa por ID', value: 'getPersonById' },
					{ name: 'Buscar centros de custos', value: 'getCostCenters' },
					{ name: 'Buscar categorias', value: 'getCategories' },
					{ name: 'Buscar contas financeiras', value: 'getFinancialAccounts' },
					{ name: 'Buscar produtos por filtro', value: 'getProductsByFilter' },
					{ name: 'Buscar receitas por filtro', value: 'getRevenuesByFilter' },
					{ name: 'Buscar despesas por filtro', value: 'getExpensesByFilter' },
					{ name: 'Buscar parcela por ID', value: 'getInstallmentById' },
					{ name: 'Criar produto', value: 'createProduct' },
					{ name: 'Criar pessoa', value: 'createPerson' },
					{ name: 'Criar venda', value: 'createSale' },
				],
				default: 'getAllServices',
			},
			{
				displayName: 'ID do Serviço',
				name: 'serviceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getServiceById'],
					},
				},
				default: '',
				description: 'ID do serviço para buscar',
			},
			{
				displayName: 'Busca textual',
				name: 'busca_textual',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getAllServices'],
					},
				},
				default: '',
				description: 'Busca textual por nome, código ou descrição do serviço',
			},
			{
				displayName: 'Página',
				name: 'pagina',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAllServices'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página',
				name: 'tamanho_pagina',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAllServices'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Busca textual (venda)',
				name: 'busca_textual_venda',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getSalesByFilter'],
					},
				},
				default: '',
				description: 'Busca textual por nome do cliente, número da venda ou email do cliente',
			},
			{
				displayName: 'Página (venda)',
				name: 'pagina_venda',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getSalesByFilter'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página (venda)',
				name: 'tamanho_pagina_venda',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getSalesByFilter'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'ID da Venda',
				name: 'saleId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getSaleById'],
					},
				},
				default: '',
				description: 'ID (UUID) da venda para buscar',
			},
			{
				displayName: 'Termo de busca',
				name: 'termo_busca',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getPersonsByFilter'],
					},
				},
				default: '',
				description: 'Busca por documento, nome do cliente ou nome da empresa',
			},
			{
				displayName: 'Página (pessoa)',
				name: 'pagina_pessoa',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPersonsByFilter'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página (pessoa)',
				name: 'tamanho_pagina_pessoa',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPersonsByFilter'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'ID da Pessoa',
				name: 'personId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getPersonById'],
					},
				},
				default: '',
				description: 'ID (UUID) do cadastro de pessoa para buscar o resumo',
			},
			{
				displayName: 'Busca',
				name: 'busca_centro',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getCostCenters'],
					},
				},
				default: '',
				description: 'Busca por nome ou código do centro de custo',
			},
			{
				displayName: 'Filtro rápido',
				name: 'filtro_rapido',
				type: 'options',
				options: [
					{ name: 'Ativo', value: 'ATIVO' },
					{ name: 'Inativo', value: 'INATIVO' },
					{ name: 'Todos', value: 'TODOS' },
				],
				displayOptions: {
					show: {
						operation: ['getCostCenters'],
					},
				},
				default: 'ATIVO',
				description: 'Filtrar centros de custo por status',
			},
			{
				displayName: 'Página',
				name: 'pagina_centro',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getCostCenters'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página',
				name: 'tamanho_pagina_centro',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getCostCenters'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Busca (categoria)',
				name: 'busca_categoria',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getCategories'],
					},
				},
				default: '',
				description: 'Busca por nome ou código da categoria',
			},
			{
				displayName: 'Tipo',
				name: 'tipo_categoria',
				type: 'options',
				options: [
					{ name: 'Receita', value: 'RECEITA' },
					{ name: 'Despesa', value: 'DESPESA' },
				],
				displayOptions: {
					show: {
						operation: ['getCategories'],
					},
				},
				default: 'RECEITA',
				description: 'Tipo da categoria',
			},
			{
				displayName: 'Página (categoria)',
				name: 'pagina_categoria',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getCategories'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página (categoria)',
				name: 'tamanho_pagina_categoria',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getCategories'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Nome da conta',
				name: 'nome_conta',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getFinancialAccounts'],
					},
				},
				default: '',
				description: 'Nome da conta financeira',
			},
			{
				displayName: 'Tipos de conta',
				name: 'tipos',
				type: 'multiOptions',
				options: [
					{ name: 'Aplicação', value: 'APLICACAO' },
					{ name: 'Caixinha', value: 'CAIXINHA' },
					{ name: 'Conta Corrente', value: 'CONTA_CORRENTE' },
					{ name: 'Cartão de Crédito', value: 'CARTAO_CREDITO' },
					{ name: 'Investimento', value: 'INVESTIMENTO' },
					{ name: 'Outros', value: 'OUTROS' },
					{ name: 'Meios de Recebimento', value: 'MEIOS_RECEBIMENTO' },
					{ name: 'Poupança', value: 'POUPANCA' },
					{ name: 'Cobranças Conta Azul', value: 'COBRANCAS_CONTA_AZUL' },
					{ name: 'Receba Fácil Cartão', value: 'RECEBA_FACIL_CARTAO' },
				],
				displayOptions: {
					show: {
						operation: ['getFinancialAccounts'],
					},
				},
				default: [],
				description: 'Tipos de conta financeira',
			},
			{
				displayName: 'Apenas ativos',
				name: 'apenas_ativo',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getFinancialAccounts'],
					},
				},
				default: true,
				description: 'Filtrar apenas contas ativas',
			},
			{
				displayName: 'Página',
				name: 'pagina_conta',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getFinancialAccounts'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página',
				name: 'tamanho_pagina_conta',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getFinancialAccounts'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Busca (produto)',
				name: 'busca_produto',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getProductsByFilter'],
					},
				},
				default: '',
				description: 'Buscar produtos por nome ou código',
			},
			{
				displayName: 'Status',
				name: 'status_produto',
				type: 'options',
				options: [
					{ name: 'Ativo', value: 'ATIVO' },
					{ name: 'Inativo', value: 'INATIVO' },
					{ name: 'Todos', value: 'TODOS' },
				],
				displayOptions: {
					show: {
						operation: ['getProductsByFilter'],
					},
				},
				default: 'TODOS',
				description: 'Status do produto',
			},
			{
				displayName: 'Campo de ordenação',
				name: 'campo_ordenacao',
				type: 'options',
				options: [
					{ name: 'Nome', value: 'NOME' },
					{ name: 'Código', value: 'CODIGO' },
					{ name: 'Valor de Venda', value: 'VALOR_VENDA' },
					{ name: 'Estoque', value: 'ESTOQUE' },
				],
				displayOptions: {
					show: {
						operation: ['getProductsByFilter'],
					},
				},
				default: 'NOME',
				description: 'Campo para ordenar os resultados',
			},
			{
				displayName: 'Direção da ordenação',
				name: 'direcao_ordenacao',
				type: 'options',
				options: [
					{ name: 'Ascendente', value: 'ASC' },
					{ name: 'Descendente', value: 'DESC' },
				],
				displayOptions: {
					show: {
						operation: ['getProductsByFilter'],
					},
				},
				default: 'ASC',
				description: 'Direção da ordenação',
			},
			{
				displayName: 'Página (produto)',
				name: 'pagina_produto',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getProductsByFilter'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página (produto)',
				name: 'tamanho_pagina_produto',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getProductsByFilter'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Busca (receita)',
				name: 'busca_receita',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getRevenuesByFilter'],
					},
				},
				default: '',
				description: 'Buscar receitas por nome, número, etc.',
			},
			{
				displayName: 'Página (receita)',
				name: 'pagina_receita',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getRevenuesByFilter'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página (receita)',
				name: 'tamanho_pagina_receita',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getRevenuesByFilter'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Data de vencimento (de)',
				name: 'data_vencimento_de',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: ['getRevenuesByFilter'],
					},
				},
				default: '',
				description: 'Data inicial de vencimento (formato YYYY-MM-DD, obrigatório)',
			},
			{
				displayName: 'Data de vencimento (até)',
				name: 'data_vencimento_ate',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: ['getRevenuesByFilter'],
					},
				},
				default: '',
				description: 'Data final de vencimento (formato YYYY-MM-DD, obrigatório)',
			},
			{
				displayName: 'Busca (despesa)',
				name: 'busca_despesa',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getExpensesByFilter'],
					},
				},
				default: '',
				description: 'Buscar despesas por nome, número, etc.',
			},
			{
				displayName: 'Página (despesa)',
				name: 'pagina_despesa',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getExpensesByFilter'],
					},
				},
				default: 1,
				description: 'Número da página',
			},
			{
				displayName: 'Tamanho da página (despesa)',
				name: 'tamanho_pagina_despesa',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getExpensesByFilter'],
					},
				},
				default: 10,
				description: 'Quantidade de itens por página',
			},
			{
				displayName: 'Data de vencimento (de)',
				name: 'data_vencimento_de_despesa',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: ['getExpensesByFilter'],
					},
				},
				default: '',
				description: 'Data inicial de vencimento (formato YYYY-MM-DD, obrigatório)',
			},
			{
				displayName: 'Data de vencimento (até)',
				name: 'data_vencimento_ate_despesa',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: ['getExpensesByFilter'],
					},
				},
				default: '',
				description: 'Data final de vencimento (formato YYYY-MM-DD, obrigatório)',
			},
			{
				displayName: 'ID da Parcela',
				name: 'installmentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getInstallmentById'],
					},
				},
				default: '',
				description: 'ID (UUID) da parcela para buscar',
			},
			{
				displayName: 'Nome do Produto',
				name: 'nome',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: '',
				description: 'Nome do produto',
			},
			{
				displayName: 'SKU',
				name: 'codigo_sku',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: '',
				description: 'Código SKU do produto',
			},
			{
				displayName: 'EAN',
				name: 'codigo_ean',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: '',
				description: 'Código EAN do produto',
			},
			{
				displayName: 'Observação',
				name: 'observacao',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: '',
				description: 'Observação do produto',
			},
			{
				displayName: 'Quantidade em Estoque',
				name: 'estoque_disponivel',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Quantidade total em estoque',
			},
			{
				displayName: 'Valor de Venda',
				name: 'valor_venda',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Valor de venda do produto',
			},
			{
				displayName: 'Custo Médio',
				name: 'custo_medio',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Custo médio do produto',
			},
			{
				displayName: 'Estoque Mínimo',
				name: 'estoque_minimo',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Estoque mínimo do produto',
			},
			{
				displayName: 'Estoque Máximo',
				name: 'estoque_maximo',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Estoque máximo do produto',
			},
			{
				displayName: 'Altura (cm)',
				name: 'altura',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Altura do produto em centímetros',
			},
			{
				displayName: 'Largura (cm)',
				name: 'largura',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Largura do produto em centímetros',
			},
			{
				displayName: 'Profundidade (cm)',
				name: 'profundidade',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 0,
				description: 'Profundidade do produto em centímetros',
			},
			{
				displayName: 'Formato',
				name: 'formato',
				type: 'options',
				options: [
					{ name: 'Simples', value: 'SIMPLES' },
				],
				required: true,
				displayOptions: {
					show: {
						operation: ['createProduct'],
					},
				},
				default: 'SIMPLES',
				description: 'Formato do produto (apenas simples)',
			},
			{
				displayName: 'Tipo de Pessoa',
				name: 'tipo_pessoa',
				type: 'options',
				options: [
					{ name: 'Física', value: 'FISICA' },
					{ name: 'Jurídica', value: 'JURIDICA' },
					{ name: 'Estrangeira', value: 'ESTRANGEIRA' },
				],
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: 'FISICA',
			},
			{
				displayName: 'Nome',
				name: 'nome',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: false,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Telefone',
				name: 'telefone',
				type: 'string',
				required: false,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Perfis',
				name: 'tipo_perfil',
				type: 'multiOptions',
				options: [
					{ name: 'Cliente', value: 'CLIENTE' },
					{ name: 'Fornecedor', value: 'FORNECEDOR' },
					{ name: 'Transportadora', value: 'TRANSPORTADORA' },
				],
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: [],
			},
			{
				displayName: 'CEP',
				name: 'cep',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Logradouro',
				name: 'logradouro',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Número',
				name: 'numero',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Complemento',
				name: 'complemento',
				type: 'string',
				required: false,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Bairro',
				name: 'bairro',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Cidade',
				name: 'cidade',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'Estado',
				name: 'estado',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: '',
			},
			{
				displayName: 'CPF',
				name: 'cpf',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['createPerson'],
						tipo_pessoa: ['FISICA'],
					},
				},
				default: '',
				description: 'CPF da pessoa física',
			},
			{
				displayName: 'CNPJ',
				name: 'cnpj',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['createPerson'],
						tipo_pessoa: ['JURIDICA'],
					},
				},
				default: '',
				description: 'CNPJ da pessoa jurídica',
			},
			{
				displayName: 'País',
				name: 'pais',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createPerson'] } },
				default: 'Brasil',
				description: 'País do endereço (fixo Brasil)',
			},
			{
				displayName: 'ID do Cliente',
				name: 'id_cliente',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: '',
				description: 'UUID do cliente associado à venda',
			},
			{
				displayName: 'Número da Venda',
				name: 'numero',
				type: 'number',
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: 1,
				description: 'Número da venda',
			},
			{
				displayName: 'Data da Venda',
				name: 'data_venda',
				type: 'dateTime',
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: '',
				description: 'Data da venda (formato YYYY-MM-DDTHH:mm:ssZ)',
			},
			{
				displayName: 'Opção da Condição de Pagamento',
				name: 'opcao_condicao_pagamento',
				type: 'string',
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: '',
				description: 'Ex: À vista, 3x, 30,60,90, etc.',
			},
			{
				displayName: 'Parcelas',
				name: 'parcelas',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: {},
				options: [
					{
						name: 'parcela',
						displayName: 'Parcela',
						values: [
							{
								displayName: 'Data de Vencimento',
								name: 'data_vencimento',
								type: 'dateTime',
								required: true,
								default: '',
							},
							{
								displayName: 'Valor',
								name: 'valor',
								type: 'number',
								required: true,
								default: 0,
							},
							{
								displayName: 'Descrição',
								name: 'descricao',
								type: 'string',
								required: false,
								default: '',
							},
						],
					},
				],
				description: 'Parcelas da venda',
			},
			{
				displayName: 'Forma de Pagamento',
				name: 'tipo_pagamento',
				type: 'options',
				options: [
					{ name: 'Boleto Bancário', value: 'BOLETO_BANCARIO' },
					{ name: 'Cartão de Crédito', value: 'CARTAO_CREDITO' },
					{ name: 'Cartão de Débito', value: 'CARTAO_DEBITO' },
					{ name: 'Carteira Digital', value: 'CARTEIRA_DIGITAL' },
					{ name: 'Cashback', value: 'CASHBACK' },
					{ name: 'Cheque', value: 'CHEQUE' },
					{ name: 'Crédito Loja', value: 'CREDITO_LOJA' },
					{ name: 'Crédito Virtual', value: 'CREDITO_VIRTUAL' },
					{ name: 'Depósito Bancário', value: 'DEPOSITO_BANCARIO' },
					{ name: 'Dinheiro', value: 'DINHEIRO' },
					{ name: 'Outro', value: 'OUTRO' },
					{ name: 'Débito Automático', value: 'DEBITO_AUTOMATICO' },
					{ name: 'Cartão Crédito via Link', value: 'CARTAO_CREDITO_VIA_LINK' },
					{ name: 'PIX Pagamento Instantâneo', value: 'PIX_PAGAMENTO_INSTANTANEO' },
					{ name: 'PIX Cobrança', value: 'PIX_COBRANCA' },
					{ name: 'Programa Fidelidade', value: 'PROGRAMA_FIDELIDADE' },
					{ name: 'Sem Pagamento', value: 'SEM_PAGAMENTO' },
					{ name: 'Transferência Bancária', value: 'TRANSFERENCIA_BANCARIA' },
					{ name: 'Vale Alimentação', value: 'VALE_ALIMENTACAO' },
					{ name: 'Vale Combustível', value: 'VALE_COMBUSTIVEL' },
					{ name: 'Vale Presente', value: 'VALE_PRESENTE' },
					{ name: 'Vale Refeição', value: 'VALE_REFEICAO' },
				],
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: 'DINHEIRO',
				description: 'Forma de pagamento',
			},
			{
				displayName: 'Situação',
				name: 'situacao',
				type: 'options',
				options: [
					{ name: 'Em andamento', value: 'EM_ANDAMENTO' },
					{ name: 'Aprovado', value: 'APROVADO' },
					{ name: 'Faturado', value: 'FATURADO' },
				],
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: 'EM_ANDAMENTO',
				description: 'Situação da venda',
			},
			{
				displayName: 'Observações',
				name: 'observacoes',
				type: 'string',
				required: false,
				displayOptions: { show: { operation: ['createSale'] } },
				default: '',
				description: 'Observações da venda',
			},
			{
				displayName: 'Observações do Pagamento',
				name: 'observacoes_pagamento',
				type: 'string',
				required: false,
				displayOptions: { show: { operation: ['createSale'] } },
				default: '',
				description: 'Observações do pagamento',
			},
			{
				displayName: 'Itens',
				name: 'itens',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				displayOptions: { show: { operation: ['createSale'] } },
				default: {},
				options: [
					{
						name: 'item',
						displayName: 'Item',
						values: [
							{
								displayName: 'ID do Produto/Serviço',
								name: 'id',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Descrição',
								name: 'descricao',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Quantidade',
								name: 'quantidade',
								type: 'number',
								required: true,
								default: 1,
							},
							{
								displayName: 'Valor',
								name: 'valor',
								type: 'number',
								required: true,
								default: 0,
							},
						],
					},
				],
				description: 'Itens da venda',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const operation = this.getNodeParameter('operation', 0) as string;

		if (operation === 'getAllServices') {
			return [
				await getAllServices.call(this),
			];
		}

		if (operation === 'getServiceById') {
			return [
				await getServiceById.call(this),
			];
		}

		if (operation === 'getSalesByFilter') {
			return [
				await getSalesByFilter.call(this),
			];
		}

		if (operation === 'getSaleById') {
			return [
				await getSaleById.call(this),
			];
		}

		if (operation === 'getPersonsByFilter') {
			return [
				await getPersonsByFilter.call(this),
			];
		}

		if (operation === 'getPersonById') {
			return [
				await getPersonById.call(this),
			];
		}

		if (operation === 'getCostCenters') {
			return [
				await getCostCenters.call(this),
			];
		}

		if (operation === 'getCategories') {
			return [
				await getCategories.call(this),
			];
		}

		if (operation === 'getFinancialAccounts') {
			return [
				await getFinancialAccounts.call(this),
			];
		}

		if (operation === 'getProductsByFilter') {
			return [
				await getProductsByFilter.call(this),
			];
		}

		if (operation === 'getRevenuesByFilter') {
			return [
				await getRevenuesByFilter.call(this),
			];
		}

		if (operation === 'getExpensesByFilter') {
			return [
				await getExpensesByFilter.call(this),
			];
		}

		if (operation === 'getInstallmentById') {
			return [
				await getInstallmentById.call(this),
			];
		}

		if (operation === 'createProduct') {
			return [
				await createProduct.call(this),
			];
		}

		if (operation === 'createPerson') {
			return [
				await createPerson.call(this),
			];
		}

		if (operation === 'createSale') {
			return [
				await createSale.call(this),
			];
		}
	
		throw new Error('Operação não suportada');
	}
} 