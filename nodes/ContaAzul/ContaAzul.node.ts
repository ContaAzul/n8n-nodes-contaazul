import { IExecuteFunctions, INodeType, INodeTypeDescription, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { getAllServices, getServiceById } from './servicos';
import { getProductsByFilter, createProduct } from './produtos';
import { getCategories } from './categorias';
import { getCostCenters } from './centroCusto';
import { getPersonsByFilter, getPersonById } from './pessoas';
import {
  getFinancialAccounts,
  getRevenuesByFilter,
  getExpensesByFilter,
  getInstallmentById,
} from './financeiro';
import { getSalesByFilter, getSaleById, createSale } from './vendas';
import { createPerson } from './pessoas';

export class ContaAzul implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Conta Azul API',
    name: 'contaAzul',
    icon: 'file:contaazul.svg',
    group: ['transform'],
    version: 1,
    description: 'Allows making requests to the Conta Azul API',
    defaults: {
      name: 'Conta Azul',
    },
    inputs: ['main' as NodeConnectionType],
    outputs: ['main' as NodeConnectionType],
    credentials: [
      {
        name: 'contaAzulOAuth2Api',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
								noDataExpression: true,
        options: [
          { name: 'Create Person', value: 'createPerson' },
          { name: 'Create Product', value: 'createProduct' },
          { name: 'Create Sale', value: 'createSale' },
          { name: 'Search Categories', value: 'getCategories' },
          { name: 'Search Cost Centers', value: 'getCostCenters' },
          { name: 'Search Expenses By Filter', value: 'getExpensesByFilter' },
          { name: 'Search Financial Accounts', value: 'getFinancialAccounts' },
          { name: 'Search Installment By ID', value: 'getInstallmentById' },
          { name: 'Search Person By ID', value: 'getPersonById' },
          { name: 'Search Persons By Filter', value: 'getPersonsByFilter' },
          { name: 'Search Products By Filter', value: 'getProductsByFilter' },
          { name: 'Search Revenues By Filter', value: 'getRevenuesByFilter' },
          { name: 'Search Sale By ID', value: 'getSaleById' },
          { name: 'Search Sales By Filter', value: 'getSalesByFilter' },
          { name: 'Search Service By ID', value: 'getServiceById' },
          { name: 'Search Services By Filter', value: 'getAllServices' },
        ],
        default: 'getAllServices',
      },
      {
        displayName: 'Service ID',
        name: 'serviceId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getServiceById'],
          },
        },
        default: '',
        description: 'Service ID to search for',
      },
      {
        displayName: 'Text Search',
        name: 'busca_textual',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getAllServices'],
          },
        },
        default: '',
        description: 'Text search by name, code or service description',
      },
      {
        displayName: 'Page',
        name: 'pagina',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getAllServices'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size',
        name: 'tamanho_pagina',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getAllServices'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Text Search (Sale)',
        name: 'busca_textual_venda',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getSalesByFilter'],
          },
        },
        default: '',
        description: 'Text search by customer name, sale number or customer email',
      },
      {
        displayName: 'Page (Sale)',
        name: 'pagina_venda',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getSalesByFilter'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size (Sale)',
        name: 'tamanho_pagina_venda',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getSalesByFilter'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Sale ID',
        name: 'saleId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getSaleById'],
          },
        },
        default: '',
        description: 'Sale ID (UUID) to search for',
      },
      {
        displayName: 'Search Term',
        name: 'termo_busca',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getPersonsByFilter'],
          },
        },
        default: '',
        description: 'Search by document, customer name or company name',
      },
      {
        displayName: 'Page (Person)',
        name: 'pagina_pessoa',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getPersonsByFilter'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size (Person)',
        name: 'tamanho_pagina_pessoa',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getPersonsByFilter'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Person ID',
        name: 'personId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getPersonById'],
          },
        },
        default: '',
        description: 'Person ID (UUID) to search for summary',
      },
      {
        displayName: 'Search',
        name: 'busca_centro',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getCostCenters'],
          },
        },
        default: '',
        description: 'Search by name or cost center code',
      },
      {
        displayName: 'Quick Filter',
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
        description: 'Filter cost centers by status',
      },
      {
        displayName: 'Page',
        name: 'pagina_centro',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getCostCenters'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size',
        name: 'tamanho_pagina_centro',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getCostCenters'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Search (Category)',
        name: 'busca_categoria',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getCategories'],
          },
        },
        default: '',
        description: 'Search by name or category code',
      },
      {
        displayName: 'Type',
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
        description: 'Category type',
      },
      {
        displayName: 'Page (Category)',
        name: 'pagina_categoria',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getCategories'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size (Category)',
        name: 'tamanho_pagina_categoria',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getCategories'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Financial Account Name',
        name: 'nome_conta',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getFinancialAccounts'],
          },
        },
        default: '',
      },
      {
        displayName: 'Financial Account Types',
        name: 'tipos',
        type: 'multiOptions',
        options: [
          { name: 'Aplicação', value: 'APLICACAO' },
          { name: 'Caixinha', value: 'CAIXINHA' },
          { name: 'Cartão De Crédito', value: 'CARTAO_CREDITO' },
          { name: 'Cobranças Conta Azul', value: 'COBRANCAS_CONTA_AZUL' },
          { name: 'Conta Corrente', value: 'CONTA_CORRENTE' },
          { name: 'Investimento', value: 'INVESTIMENTO' },
          { name: 'Meios De Recebimento', value: 'MEIOS_RECEBIMENTO' },
          { name: 'Outros', value: 'OUTROS' },
          { name: 'Poupança', value: 'POUPANCA' },
          { name: 'Receba Fácil Cartão', value: 'RECEBA_FACIL_CARTAO' },
        ],
        displayOptions: {
          show: {
            operation: ['getFinancialAccounts'],
          },
        },
        default: [],
      },
      {
        displayName: 'Only Active',
        name: 'apenas_ativo',
        type: 'boolean',
        displayOptions: {
          show: {
            operation: ['getFinancialAccounts'],
          },
        },
        default: true,
        description: 'Whether to filter only active accounts',
      },
      {
        displayName: 'Page',
        name: 'pagina_conta',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getFinancialAccounts'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size',
        name: 'tamanho_pagina_conta',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getFinancialAccounts'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Search (Product)',
        name: 'busca_produto',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getProductsByFilter'],
          },
        },
        default: '',
        description: 'Search products by name or code',
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
        description: 'Product status',
      },
      {
        displayName: 'Sort Field',
        name: 'campo_ordenacao',
        type: 'options',
        options: [
          { name: 'Nome', value: 'NOME' },
          { name: 'Código', value: 'CODIGO' },
          { name: 'Valor De Venda', value: 'VALOR_VENDA' },
          { name: 'Estoque', value: 'ESTOQUE' },
        ],
        displayOptions: {
          show: {
            operation: ['getProductsByFilter'],
          },
        },
        default: 'NOME',
        description: 'Field to order results',
      },
      {
        displayName: 'Sort Direction',
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
      },
      {
        displayName: 'Page (Product)',
        name: 'pagina_produto',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getProductsByFilter'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size (Product)',
        name: 'tamanho_pagina_produto',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getProductsByFilter'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Search (Revenue)',
        name: 'busca_receita',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getRevenuesByFilter'],
          },
        },
        default: '',
        description: 'Search revenues by name, number, etc',
      },
      {
        displayName: 'Page (Revenue)',
        name: 'pagina_receita',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getRevenuesByFilter'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size (Revenue)',
        name: 'tamanho_pagina_receita',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getRevenuesByFilter'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Due Date (From)',
        name: 'data_vencimento_de',
        type: 'dateTime',
        required: true,
        displayOptions: {
          show: {
            operation: ['getRevenuesByFilter'],
          },
        },
        default: '',
        description: 'Initial due date (format YYYY-MM-DD, required)',
      },
      {
        displayName: 'Due Date (Until)',
        name: 'data_vencimento_ate',
        type: 'dateTime',
        required: true,
        displayOptions: {
          show: {
            operation: ['getRevenuesByFilter'],
          },
        },
        default: '',
        description: 'Final due date (format YYYY-MM-DD, required)',
      },
      {
        displayName: 'Search (Expense)',
        name: 'busca_despesa',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getExpensesByFilter'],
          },
        },
        default: '',
        description: 'Search expenses by name, number, etc',
      },
      {
        displayName: 'Page (Expense)',
        name: 'pagina_despesa',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getExpensesByFilter'],
          },
        },
        default: 1,
        description: 'Page number',
      },
      {
        displayName: 'Page Size (Expense)',
        name: 'tamanho_pagina_despesa',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getExpensesByFilter'],
          },
        },
        default: 10,
        description: 'Number of items per page',
      },
      {
        displayName: 'Due Date (From)',
        name: 'data_vencimento_de_despesa',
        type: 'dateTime',
        required: true,
        displayOptions: {
          show: {
            operation: ['getExpensesByFilter'],
          },
        },
        default: '',
        description: 'Initial due date (format YYYY-MM-DD, required)',
      },
      {
        displayName: 'Due Date (Until)',
        name: 'data_vencimento_ate_despesa',
        type: 'dateTime',
        required: true,
        displayOptions: {
          show: {
            operation: ['getExpensesByFilter'],
          },
        },
        default: '',
        description: 'Final due date (format YYYY-MM-DD, required)',
      },
      {
        displayName: 'Installment ID',
        name: 'installmentId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getInstallmentById'],
          },
        },
        default: '',
        description: 'Installment ID (UUID) to search for',
      },
      {
        displayName: 'Product Name',
        name: 'nome',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: '',
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
        description: 'Product SKU code',
      },
      {
        displayName: 'EAN',
        name: 'codigo_ean',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: '',
        description: 'Product EAN code',
      },
      {
        displayName: 'Observation',
        name: 'observacao',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: '',
        description: 'Product observation',
      },
      {
        displayName: 'Stock Quantity',
        name: 'estoque_disponivel',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Total stock quantity',
      },
      {
        displayName: 'Sale Value',
        name: 'valor_venda',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product sale value',
      },
      {
        displayName: 'Average Cost',
        name: 'custo_medio',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product average cost',
      },
      {
        displayName: 'Minimum Stock',
        name: 'estoque_minimo',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product minimum stock',
      },
      {
        displayName: 'Maximum Stock',
        name: 'estoque_maximo',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product maximum stock',
      },
      {
        displayName: 'Height (Cm)',
        name: 'altura',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product height in centimeters',
      },
      {
        displayName: 'Width (Cm)',
        name: 'largura',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product width in centimeters',
      },
      {
        displayName: 'Depth (Cm)',
        name: 'profundidade',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 0,
        description: 'Product depth in centimeters',
      },
      {
        displayName: 'Format',
        name: 'formato',
        type: 'options',
        options: [{ name: 'Simples', value: 'SIMPLES' }],
        required: true,
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        default: 'SIMPLES',
        description: 'Product format (only simple)',
      },
      {
        displayName: 'Person Type',
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
        displayName: 'Name',
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
								placeholder: 'name@email.com',
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'Phone',
        name: 'telefone',
        type: 'string',
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'Profiles',
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
        displayName: 'Street',
        name: 'logradouro',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'Number',
        name: 'numero',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'Complement',
        name: 'complemento',
        type: 'string',
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'Neighborhood',
        name: 'bairro',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'City',
        name: 'cidade',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createPerson'] } },
        default: '',
      },
      {
        displayName: 'State',
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
        displayOptions: {
          show: {
            operation: ['createPerson'],
            tipo_pessoa: ['FISICA'],
          },
        },
        default: '',
        description: 'CPF of the physical person',
      },
      {
        displayName: 'CNPJ',
        name: 'cnpj',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['createPerson'],
            tipo_pessoa: ['JURIDICA'],
          },
        },
        default: '',
        description: 'CNPJ of the legal person',
      },
      {
        displayName: 'Country',
        name: 'pais',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createPerson'] } },
        default: 'Brasil',
        description: 'Address country (fixed Brasil)',
      },
      {
        displayName: 'Client ID',
        name: 'id_cliente',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createSale'] } },
        default: '',
        description: 'UUID of the client associated with the sale',
      },
      {
        displayName: 'Sale Number',
        name: 'numero',
        type: 'number',
        required: true,
        displayOptions: { show: { operation: ['createSale'] } },
        default: 1,
      },
      {
        displayName: 'Sale Date',
        name: 'data_venda',
        type: 'dateTime',
        required: true,
        displayOptions: { show: { operation: ['createSale'] } },
        default: '',
        description: 'Sale date (format YYYY-MM-DDTHH:mm:ssZ)',
      },
      {
        displayName: 'Payment Condition Option',
        name: 'opcao_condicao_pagamento',
        type: 'string',
        required: true,
        displayOptions: { show: { operation: ['createSale'] } },
        default: '',
        description: 'Ex: À vista, 3x, 30,60,90, etc',
      },
      {
        displayName: 'Installments',
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
            displayName: 'Installment',
            values: [
              {
                displayName: 'Due Date',
                name: 'data_vencimento',
                type: 'dateTime',
                required: true,
                default: '',
              },
              {
                displayName: 'Value',
                name: 'valor',
                type: 'number',
                required: true,
                default: 0,
              },
              {
                displayName: 'Description',
                name: 'descricao',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
        description: 'Sale installments',
      },
      {
        displayName: 'Payment Method',
        name: 'tipo_pagamento',
        type: 'options',
        options: [
          { name: 'Boleto Bancário', value: 'BOLETO_BANCARIO' },
          { name: 'Cartão Crédito via Link', value: 'CARTAO_CREDITO_VIA_LINK' },
          { name: 'Cartão De Crédito', value: 'CARTAO_CREDITO' },
          { name: 'Cartão De Débito', value: 'CARTAO_DEBITO' },
          { name: 'Carteira Digital', value: 'CARTEIRA_DIGITAL' },
          { name: 'Cashback', value: 'CASHBACK' },
          { name: 'Cheque', value: 'CHEQUE' },
          { name: 'Crédito Loja', value: 'CREDITO_LOJA' },
          { name: 'Crédito Virtual', value: 'CREDITO_VIRTUAL' },
          { name: 'Débito Automático', value: 'DEBITO_AUTOMATICO' },
          { name: 'Depósito Bancário', value: 'DEPOSITO_BANCARIO' },
          { name: 'Dinheiro', value: 'DINHEIRO' },
          { name: 'Outro', value: 'OUTRO' },
          { name: 'PIX Cobrança', value: 'PIX_COBRANCA' },
          { name: 'PIX Pagamento Instantâneo', value: 'PIX_PAGAMENTO_INSTANTANEO' },
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
      },
      {
        displayName: 'Status',
        name: 'situacao',
        type: 'options',
        options: [
          { name: 'Em Andamento', value: 'EM_ANDAMENTO' },
          { name: 'Aprovado', value: 'APROVADO' },
          { name: 'Faturado', value: 'FATURADO' },
        ],
        required: true,
        displayOptions: { show: { operation: ['createSale'] } },
        default: 'EM_ANDAMENTO',
        description: 'Sale status',
      },
      {
        displayName: 'Observations',
        name: 'observacoes',
        type: 'string',
        displayOptions: { show: { operation: ['createSale'] } },
        default: '',
        description: 'Sale observations',
      },
      {
        displayName: 'Payment Observations',
        name: 'observacoes_pagamento',
        type: 'string',
        displayOptions: { show: { operation: ['createSale'] } },
        default: '',
      },
      {
        displayName: 'Items',
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
                displayName: 'Product/Service ID',
                name: 'id',
                type: 'string',
                required: true,
                default: '',
              },
              {
                displayName: 'Description',
                name: 'descricao',
                type: 'string',
                required: true,
                default: '',
              },
              {
                displayName: 'Quantity',
                name: 'quantidade',
                type: 'number',
                required: true,
                default: 1,
              },
              {
                displayName: 'Value',
                name: 'valor',
                type: 'number',
                required: true,
                default: 0,
              },
            ],
          },
        ],
        description: 'Sale items',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const operation = this.getNodeParameter('operation', 0) as string;

    if (operation === 'getAllServices') {
      return [await getAllServices.call(this)];
    }

    if (operation === 'getServiceById') {
      return [await getServiceById.call(this)];
    }

    if (operation === 'getSalesByFilter') {
      return [await getSalesByFilter.call(this)];
    }

    if (operation === 'getSaleById') {
      return [await getSaleById.call(this)];
    }

    if (operation === 'getPersonsByFilter') {
      return [await getPersonsByFilter.call(this)];
    }

    if (operation === 'getPersonById') {
      return [await getPersonById.call(this)];
    }

    if (operation === 'getCostCenters') {
      return [await getCostCenters.call(this)];
    }

    if (operation === 'getCategories') {
      return [await getCategories.call(this)];
    }

    if (operation === 'getFinancialAccounts') {
      return [await getFinancialAccounts.call(this)];
    }

    if (operation === 'getProductsByFilter') {
      return [await getProductsByFilter.call(this)];
    }

    if (operation === 'getRevenuesByFilter') {
      return [await getRevenuesByFilter.call(this)];
    }

    if (operation === 'getExpensesByFilter') {
      return [await getExpensesByFilter.call(this)];
    }

    if (operation === 'getInstallmentById') {
      return [await getInstallmentById.call(this)];
    }

    if (operation === 'createProduct') {
      return [await createProduct.call(this)];
    }

    if (operation === 'createPerson') {
      return [await createPerson.call(this)];
    }

    if (operation === 'createSale') {
      return [await createSale.call(this)];
    }

    throw new NodeOperationError(this.getNode(), 'Operação não suportada');
  }
}
