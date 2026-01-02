import { IExecuteFunctions } from 'n8n-workflow';
import { toYYYYMMDD } from './utils';

export async function getFinancialAccounts(this: IExecuteFunctions) {
  const nome = this.getNodeParameter('nome_conta', 0, '') as string;
  const tipos = this.getNodeParameter('tipos', 0, []) as string[];
  const apenas_ativo = this.getNodeParameter('apenas_ativo', 0, true) as boolean;
  const pagina = this.getNodeParameter('pagina_conta', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter('tamanho_pagina_conta', 0, 10) as number;

  const qs: any = {
    pagina,
    tamanho_pagina,
    apenas_ativo,
  };
  if (nome) {
    qs.nome = nome;
  }
  if (tipos && tipos.length > 0) {
    qs.tipos = tipos;
  }

  const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/conta-financeira',
    qs,
    json: true,
  });
  return this.helpers.returnJsonArray(responseData);
}

export async function getRevenuesByFilter(this: IExecuteFunctions) {
  const busca = this.getNodeParameter('busca_receita', 0, '') as string;
  const pagina = this.getNodeParameter('pagina_receita', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter('tamanho_pagina_receita', 0, 10) as number;
  const data_vencimento_de_raw = this.getNodeParameter('data_vencimento_de', 0) as string;
  const data_vencimento_ate_raw = this.getNodeParameter('data_vencimento_ate', 0) as string;

  const data_vencimento_de = toYYYYMMDD(data_vencimento_de_raw);
  const data_vencimento_ate = toYYYYMMDD(data_vencimento_ate_raw);

  const qs: any = {
    pagina,
    tamanho_pagina,
    data_vencimento_de,
    data_vencimento_ate,
  };
  if (busca) {
    qs.busca = busca;
  }

  const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/financeiro/eventos-financeiros/contas-a-receber/buscar',
    qs,
    json: true,
  });
  return this.helpers.returnJsonArray(responseData.itens);
}

export async function getExpensesByFilter(this: IExecuteFunctions) {
  const busca = this.getNodeParameter('busca_despesa', 0, '') as string;
  const pagina = this.getNodeParameter('pagina_despesa', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter('tamanho_pagina_despesa', 0, 10) as number;
  const data_vencimento_de_raw = this.getNodeParameter('data_vencimento_de_despesa', 0) as string;
  const data_vencimento_ate_raw = this.getNodeParameter('data_vencimento_ate_despesa', 0) as string;

  const data_vencimento_de = toYYYYMMDD(data_vencimento_de_raw);
  const data_vencimento_ate = toYYYYMMDD(data_vencimento_ate_raw);

  const qs: any = {
    pagina,
    tamanho_pagina,
    data_vencimento_de,
    data_vencimento_ate,
  };
  if (busca) {
    qs.busca = busca;
  }

  const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/financeiro/eventos-financeiros/contas-a-pagar/buscar',
    qs,
    json: true,
  });
  return this.helpers.returnJsonArray(responseData.itens);
}

export async function getInstallmentById(this: IExecuteFunctions) {
  const installmentId = this.getNodeParameter('installmentId', 0) as string;
  const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: `https://api-v2.contaazul.com/v1/financeiro/eventos-financeiros/parcelas/${installmentId}`,
    json: true,
  });
  return this.helpers.returnJsonArray([responseData]);
}
