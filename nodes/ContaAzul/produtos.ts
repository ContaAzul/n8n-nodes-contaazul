import { IExecuteFunctions } from 'n8n-workflow';

export async function getProductsByFilter(this: IExecuteFunctions) {
  const busca = this.getNodeParameter('productAdditionalFields.busca_produto', 0, '') as string;
  const status = this.getNodeParameter('productAdditionalFields.status_produto', 0, 'ATIVO') as string;
  const campo_ordenacao = this.getNodeParameter('productAdditionalFields.campo_ordenacao', 0, 'NOME') as string;
  const direcao_ordenacao = this.getNodeParameter('productAdditionalFields.direcao_ordenacao', 0, 'ASC') as string;
  const pagina = this.getNodeParameter('productAdditionalFields.pagina_produto', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter(
    'productAdditionalFields.tamanho_pagina_produto',
    0,
    10,
  ) as number;

  const qs: any = {
    pagina,
    tamanho_pagina,
    status,
    campo_ordenacao,
    direcao_ordenacao,
  };
  if (busca) {
    qs.busca = busca;
  }

  const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/produtos',
    qs,
    json: true,
  });
  const items = (responseData.items || []).map((item: any) => ({
    json: item,
    pairedItem: {
      item: 0,
    },
  }));

  return items;
}

export async function createProduct(this: IExecuteFunctions) {
  const additionalFields = this.getNodeParameter(
    'productCreateAdditionalFields',
    0,
    {},
  ) as {
    codigo_sku?: string;
    estoque_disponivel?: number;
    valor_venda?: number;
    codigo_ean?: string;
    observacao?: string;
    custo_medio?: number;
    estoque_minimo?: number;
    estoque_maximo?: number;
    altura?: number;
    largura?: number;
    profundidade?: number;
    formato?: string;
  };

  const body: any = {
    nome: this.getNodeParameter('nome', 0),
  };

  if (additionalFields.codigo_sku) {
    body.codigo_sku = additionalFields.codigo_sku;
  }

  if (additionalFields.codigo_ean) {
    body.codigo = additionalFields.codigo_ean;
  }
  if (additionalFields.observacao) {
    body.observacao = additionalFields.observacao;
  }

  // Format (optional, default SIMPLES if not set)
  const formato = additionalFields.formato ?? 'SIMPLES';
  body.formato = formato;

  const estoque: any = {};

  if (additionalFields.estoque_disponivel !== undefined && additionalFields.estoque_disponivel !== 0) {
    estoque.estoque_disponivel = additionalFields.estoque_disponivel;
  }
  if (additionalFields.valor_venda !== undefined && additionalFields.valor_venda !== 0) {
    estoque.valor_venda = additionalFields.valor_venda;
  }

  if (additionalFields.custo_medio !== undefined) {
    estoque.custo_medio = additionalFields.custo_medio;
  }
  if (additionalFields.estoque_minimo !== undefined && additionalFields.estoque_minimo !== 0) {
    estoque.estoque_minimo = additionalFields.estoque_minimo;
  }
  if (additionalFields.estoque_maximo !== undefined && additionalFields.estoque_maximo !== 0) {
    estoque.estoque_maximo = additionalFields.estoque_maximo;
  }

  if (Object.keys(estoque).length > 0) {
    body.estoque = estoque;
  }

  const pesos_dimensoes: any = {};

  if (additionalFields.altura !== undefined) {
    pesos_dimensoes.altura = additionalFields.altura;
  }
  if (additionalFields.largura !== undefined) {
    pesos_dimensoes.largura = additionalFields.largura;
  }
  if (additionalFields.profundidade !== undefined) {
    pesos_dimensoes.profundidade = additionalFields.profundidade;
  }

  if (Object.keys(pesos_dimensoes).length > 0) {
    body.pesos_dimensoes = pesos_dimensoes;
  }

  const response = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'POST',
    url: 'https://api-v2.contaazul.com/v1/produtos',
    body,
    json: true,
  });

  return [{ json: response }];
}

export async function getProductById(this: IExecuteFunctions) {
  const productId = this.getNodeParameter('productId', 0);
  const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: `https://api-v2.contaazul.com/v1/produtos/${productId}`,
    json: true,
  });

  return [{ json: responseData, pairedItem: { item: 0 } }];
}
