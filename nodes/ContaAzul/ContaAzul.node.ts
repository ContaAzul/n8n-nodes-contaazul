import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';
import { getAllServices, getServiceById, createService } from './servicos';
import { getProductsByFilter, createProduct, getProductById } from './produtos';
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
          { name: 'Create Service', value: 'createService' },
          { name: 'Search Categories', value: 'getCategories' },
          { name: 'Search Cost Centers', value: 'getCostCenters' },
          { name: 'Search Expenses By Filter', value: 'getExpensesByFilter' },
          { name: 'Search Financial Accounts', value: 'getFinancialAccounts' },
          { name: 'Search Installment By ID', value: 'getInstallmentById' },
          { name: 'Search Person By ID', value: 'getPersonById' },
          { name: 'Search Persons By Filter', value: 'getPersonsByFilter' },
          { name: 'Search Product By ID', value: 'getProductById' },
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
        displayName: 'Product ID',
        name: 'productId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getProductById'],
          },
        },
        default: '',
        description: 'Product ID (UUID)',
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
        displayName: 'Description',
        name: 'descricao',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createService'],
          },
        },
        default: '',
        description: 'Service description',
      },
      {
        displayName: 'Additional Fields (Service)',
        name: 'serviceAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getAllServices'],
          },
        },
        options: [
          {
            displayName: 'Text Search',
            name: 'busca_textual',
            type: 'string',
            default: '',
            description: 'Text search by name, code or service description',
          },
          {
            displayName: 'Page',
            name: 'pagina',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
      },
      {
        displayName: 'Additional Fields (Sale)',
        name: 'saleAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getSalesByFilter'],
          },
        },
        options: [
          {
            displayName: 'Text Search (Sale)',
            name: 'busca_textual_venda',
            type: 'string',
            default: '',
            description: 'Text search by customer name, sale number or customer email',
          },
          {
            displayName: 'Page',
            name: 'pagina_venda',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_venda',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
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
        displayName: 'Additional Fields (Person Search)',
        name: 'personSearchAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getPersonsByFilter'],
          },
        },
        options: [
          {
            displayName: 'Search Term',
            name: 'termo_busca',
            type: 'string',
            default: '',
            description: 'Search by document, customer name or company name',
          },
          {
            displayName: 'Page',
            name: 'pagina_pessoa',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_pessoa',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
      },
      {
        displayName: 'Additional Fields (Service Creation)',
        name: 'serviceCreateAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['createService'],
          },
        },
        options: [
          {
            displayName: 'Code',
            name: 'codigo',
            type: 'string',
            default: '',
            description: 'Service code (e.g., SERV001)',
          },
          {
            displayName: 'Cost',
            name: 'custo',
            type: 'number',
            default: 0,
            description: 'Service cost',
          },
          {
            displayName: 'Price',
            name: 'preco',
            type: 'number',
            default: 0,
            description: 'Service price',
          },
          {
            displayName: 'Service Type',
            name: 'tipo_servico',
            type: 'string',
            default: 'PRESTADO',
            description: 'Service type (for example: PRESTADO)',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
              { name: 'Active', value: 'ATIVO' },
              { name: 'Inactive', value: 'INATIVO' },
            ],
            default: 'ATIVO',
          },
        ],
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
        displayName: 'Additional Fields (Cost Center)',
        name: 'costCenterAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getCostCenters'],
          },
        },
        options: [
          {
            displayName: 'Search',
            name: 'busca_centro',
            type: 'string',
            default: '',
            description: 'Search by name or cost center code',
          },
          {
            displayName: 'Quick Filter',
            name: 'filtro_rapido',
            type: 'options',
            options: [
              { name: 'Active', value: 'ATIVO' },
              { name: 'Inactive', value: 'INATIVO' },
              { name: 'All', value: 'TODOS' },
            ],
            default: 'ATIVO',
            description: 'Filter cost centers by status',
          },
          {
            displayName: 'Page',
            name: 'pagina_centro',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_centro',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
      },
      {
        displayName: 'Additional Fields (Category)',
        name: 'categoryAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getCategories'],
          },
        },
        options: [
          {
            displayName: 'Search (Category)',
            name: 'busca_categoria',
            type: 'string',
            default: '',
            description: 'Search by name or category code',
          },
          {
            displayName: 'Type',
            name: 'tipo_categoria',
            type: 'options',
            options: [
              { name: 'Revenue', value: 'RECEITA' },
              { name: 'Expense', value: 'DESPESA' },
            ],
            default: 'RECEITA',
            description: 'Category type',
          },
          {
            displayName: 'Page',
            name: 'pagina_categoria',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_categoria',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
      },
      {
        displayName: 'Additional Fields (Financial Account)',
        name: 'financialAccountAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getFinancialAccounts'],
          },
        },
        options: [
          {
            displayName: 'Financial Account Name',
            name: 'nome_conta',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Financial Account Types',
            name: 'tipos',
            type: 'multiOptions',
            options: [
              { name: 'Cash Box', value: 'CAIXINHA' },
              { name: 'Checking Account', value: 'CONTA_CORRENTE' },
              { name: 'Conta Azul Charges', value: 'COBRANCAS_CONTA_AZUL' },
              { name: 'Credit Card', value: 'CARTAO_CREDITO' },
              { name: 'Investment', value: 'INVESTIMENTO' },
              { name: 'Investment Account', value: 'APLICACAO' },
              { name: 'Other', value: 'OUTROS' },
              { name: 'Payment Methods', value: 'MEIOS_RECEBIMENTO' },
              { name: 'Receba Fácil Card', value: 'RECEBA_FACIL_CARTAO' },
              { name: 'Savings Account', value: 'POUPANCA' },
            ],
            default: [],
          },
          {
            displayName: 'Only Active',
            name: 'apenas_ativo',
            type: 'boolean',
            default: true,
            description: 'Whether to filter only active accounts',
          },
          {
            displayName: 'Page',
            name: 'pagina_conta',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_conta',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
      },
      {
        displayName: 'Additional Fields (Product)',
        name: 'productAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getProductsByFilter'],
          },
        },
        options: [
          {
            displayName: 'Page',
            name: 'pagina_produto',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_produto',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
          {
            displayName: 'Search (Product)',
            name: 'busca_produto',
            type: 'string',
            default: '',
            description: 'Search products by name or code',
          },
          {
            displayName: 'Sort Direction',
            name: 'direcao_ordenacao',
            type: 'options',
            options: [
              { name: 'Ascending', value: 'ASC' },
              { name: 'Descending', value: 'DESC' },
            ],
            default: 'ASC',
          },
          {
            displayName: 'Sort Field',
            name: 'campo_ordenacao',
            type: 'options',
            options: [
              { name: 'Code', value: 'CODIGO' },
              { name: 'Name', value: 'NOME' },
              { name: 'Sale Value', value: 'VALOR_VENDA' },
            ],
            default: 'NOME',
            description: 'Field to order results',
          },
          {
            displayName: 'Status',
            name: 'status_produto',
            type: 'options',
            options: [
              { name: 'Active', value: 'ATIVO' },
              { name: 'Inactive', value: 'INATIVO' },
            ],
            default: 'ATIVO',
            description: 'Product status',
          },
        ],
      },
      {
        displayName: 'Additional Fields (Revenue)',
        name: 'revenueAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getRevenuesByFilter'],
          },
        },
        options: [
          {
            displayName: 'Search (Revenue)',
            name: 'busca_receita',
            type: 'string',
            default: '',
            description: 'Search revenues by name, number, etc',
          },
          {
            displayName: 'Page',
            name: 'pagina_receita',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_receita',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
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
        displayName: 'Additional Fields (Expense)',
        name: 'expenseAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['getExpensesByFilter'],
          },
        },
        options: [
          {
            displayName: 'Search (Expense)',
            name: 'busca_despesa',
            type: 'string',
            default: '',
            description: 'Search expenses by name, number, etc',
          },
          {
            displayName: 'Page',
            name: 'pagina_despesa',
            type: 'number',
            default: 1,
            description: 'Page number',
          },
          {
            displayName: 'Page Size',
            name: 'tamanho_pagina_despesa',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
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
        displayName: 'Additional Fields (Product Creation)',
        name: 'productCreateAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['createProduct'],
          },
        },
        options: [
          {
            displayName: 'Average Cost',
            name: 'custo_medio',
            type: 'number',
            default: 0,
            description: 'Product average cost',
          },
          {
            displayName: 'Depth (Cm)',
            name: 'profundidade',
            type: 'number',
            default: 0,
            description: 'Product depth in centimeters',
          },
          {
            displayName: 'EAN',
            name: 'codigo_ean',
            type: 'string',
            default: '',
            description: 'Product EAN code',
          },
          {
            displayName: 'Format',
            name: 'formato',
            type: 'options',
            options: [{ name: 'Simples', value: 'SIMPLES' }],
            default: 'SIMPLES',
            description: 'Product format',
          },
          {
            displayName: 'Height (Cm)',
            name: 'altura',
            type: 'number',
            default: 0,
            description: 'Product height in centimeters',
          },
          {
            displayName: 'Maximum Stock',
            name: 'estoque_maximo',
            type: 'number',
            default: 0,
            description: 'Product maximum stock',
          },
          {
            displayName: 'Minimum Stock',
            name: 'estoque_minimo',
            type: 'number',
            default: 0,
            description: 'Product minimum stock',
          },
          {
            displayName: 'Observation',
            name: 'observacao',
            type: 'string',
            default: '',
            description: 'Product observation',
          },
          {
            displayName: 'Sale Value',
            name: 'valor_venda',
            type: 'number',
            default: 0,
            description: 'Product sale value',
          },
          {
            displayName: 'SKU',
            name: 'codigo_sku',
            type: 'string',
            default: '',
            description: 'Product SKU code',
          },
          {
            displayName: 'Stock Quantity',
            name: 'estoque_disponivel',
            type: 'number',
            default: 0,
            description: 'Total stock quantity',
          },
          {
            displayName: 'Width (Cm)',
            name: 'largura',
            type: 'number',
            default: 0,
            description: 'Product width in centimeters',
          },
        ],
      },
      {
        displayName: 'Person Type',
        name: 'tipo_pessoa',
        type: 'options',
        options: [
          { name: 'Individual', value: 'Física' },
          { name: 'Legal Entity', value: 'Jurídica' },
          { name: 'Foreign', value: 'Estrangeira' },
        ],
        required: true,
        displayOptions: { show: { operation: ['createPerson'] } },
        default: 'Física',
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
        displayName: 'Profiles',
        name: 'tipo_perfil',
        type: 'multiOptions',
        options: [
          { name: 'Customer', value: 'Cliente' },
          { name: 'Supplier', value: 'Fornecedor' },
          { name: 'Carrier', value: 'Transportadora' },
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
        description: 'State of the address Example: SP, RJ, MG',
      },
      {
        displayName: 'Additional Fields (Person)',
        name: 'personAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['createPerson'],
          },
        },
        options: [
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            placeholder: 'name@example.com',
            default: '',
          },
          {
            displayName: 'Phone',
            name: 'telefone',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Complement',
            name: 'complemento',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'CPF',
        name: 'cpf',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['createPerson'],
            tipo_pessoa: ['Física'],
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
            tipo_pessoa: ['Jurídica'],
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
          { name: 'Auto Debit', value: 'DEBITO_AUTOMATICO' },
          { name: 'Bank Deposit', value: 'DEPOSITO_BANCARIO' },
          { name: 'Bank Slip', value: 'BOLETO_BANCARIO' },
          { name: 'Bank Transfer', value: 'TRANSFERENCIA_BANCARIA' },
          { name: 'Cash', value: 'DINHEIRO' },
          { name: 'Cashback', value: 'CASHBACK' },
          { name: 'Check', value: 'CHEQUE' },
          { name: 'Credit Card', value: 'CARTAO_CREDITO' },
          { name: 'Credit Card via Link', value: 'CARTAO_CREDITO_VIA_LINK' },
          { name: 'Debit Card', value: 'CARTAO_DEBITO' },
          { name: 'Digital Wallet', value: 'CARTEIRA_DIGITAL' },
          { name: 'Food Voucher', value: 'VALE_REFEICAO' },
          { name: 'Fuel Voucher', value: 'VALE_COMBUSTIVEL' },
          { name: 'Gift Card', value: 'VALE_PRESENTE' },
          { name: 'Instant PIX', value: 'PIX_PAGAMENTO_INSTANTANEO' },
          { name: 'Loyalty Program', value: 'PROGRAMA_FIDELIDADE' },
          { name: 'Meal Voucher', value: 'VALE_ALIMENTACAO' },
          { name: 'No Payment', value: 'SEM_PAGAMENTO' },
          { name: 'Other', value: 'OUTRO' },
          { name: 'PIX Invoice', value: 'PIX_COBRANCA' },
          { name: 'Store Credit', value: 'CREDITO_LOJA' },
          { name: 'Virtual Credit', value: 'CREDITO_VIRTUAL' },
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
          { name: 'In Progress', value: 'EM_ANDAMENTO' },
          { name: 'Approved', value: 'APROVADO' },
        ],
        required: true,
        displayOptions: { show: { operation: ['createSale'] } },
        default: 'EM_ANDAMENTO',
        description: 'Sale status',
      },
      {
        displayName: 'Additional Fields (Sale Creation)',
        name: 'saleCreateAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: {
          show: {
            operation: ['createSale'],
          },
        },
        options: [
          {
            displayName: 'Observations',
            name: 'observacoes',
            type: 'string',
            default: '',
            description: 'Sale observations',
          },
          {
            displayName: 'Payment Observations',
            name: 'observacoes_pagamento',
            type: 'string',
            default: '',
          },
        ],
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
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        let result: INodeExecutionData[] = [];

        if (operation === 'getAllServices') {
          result = (await getAllServices.call(this)) as INodeExecutionData[];
        } else if (operation === 'getServiceById') {
          result = (await getServiceById.call(this)) as INodeExecutionData[];
        } else if (operation === 'createService') {
          result = (await createService.call(this)) as INodeExecutionData[];
        } else if (operation === 'getSalesByFilter') {
          result = (await getSalesByFilter.call(this)) as INodeExecutionData[];
        } else if (operation === 'getSaleById') {
          result = (await getSaleById.call(this)) as INodeExecutionData[];
        } else if (operation === 'getPersonsByFilter') {
          result = (await getPersonsByFilter.call(this)) as INodeExecutionData[];
        } else if (operation === 'getPersonById') {
          result = (await getPersonById.call(this)) as INodeExecutionData[];
        } else if (operation === 'getCostCenters') {
          result = (await getCostCenters.call(this)) as INodeExecutionData[];
        } else if (operation === 'getCategories') {
          result = (await getCategories.call(this)) as INodeExecutionData[];
        } else if (operation === 'getFinancialAccounts') {
          result = (await getFinancialAccounts.call(this)) as INodeExecutionData[];
        } else if (operation === 'getProductById') {
          result = (await getProductById.call(this)) as INodeExecutionData[];
        } else if (operation === 'getProductsByFilter') {
          result = (await getProductsByFilter.call(this)) as INodeExecutionData[];
        } else if (operation === 'getRevenuesByFilter') {
          result = (await getRevenuesByFilter.call(this)) as INodeExecutionData[];
        } else if (operation === 'getExpensesByFilter') {
          result = (await getExpensesByFilter.call(this)) as INodeExecutionData[];
        } else if (operation === 'getInstallmentById') {
          result = (await getInstallmentById.call(this)) as INodeExecutionData[];
        } else if (operation === 'createProduct') {
          result = (await createProduct.call(this)) as INodeExecutionData[];
        } else if (operation === 'createPerson') {
          result = (await createPerson.call(this)) as INodeExecutionData[];
        } else if (operation === 'createSale') {
          result = (await createSale.call(this)) as INodeExecutionData[];
        } else {
          throw new NodeOperationError(this.getNode(), 'Operation not supported');
        }

        for (const outputItem of result) {
          outputItem.pairedItem = { item: i };
          returnData.push(outputItem);
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }

        if (error instanceof NodeOperationError) {
          throw error;
        }

        throw new NodeOperationError(this.getNode(), error as Error);
      }
    }

    return [returnData];
  }
}
