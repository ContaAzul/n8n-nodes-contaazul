import { IExecuteFunctions } from 'n8n-workflow';

export async function getProductsByFilter(this: IExecuteFunctions) {
  const busca = this.getNodeParameter('busca_produto', 0, '') as string;
  const status = this.getNodeParameter('status_produto', 0, 'TODOS') as string;
  const campo_ordenacao = this.getNodeParameter('campo_ordenacao', 0, 'NOME') as string;
  const direcao_ordenacao = this.getNodeParameter('direcao_ordenacao', 0, 'ASC') as string;
  const pagina = this.getNodeParameter('pagina_produto', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter('tamanho_pagina_produto', 0, 10) as number;

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

  const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/produto/busca',
    qs,
    json: true,
  });
  return this.helpers.returnJsonArray(responseData.itens);
}

export async function createProduct(this: IExecuteFunctions) {
  const body: any = {
    nome: this.getNodeParameter('nome', 0),
    codigo_sku: this.getNodeParameter('codigo_sku', 0),
    codigo_ean: this.getNodeParameter('codigo_ean', 0),
    observacao: this.getNodeParameter('observacao', 0),
    formato: this.getNodeParameter('formato', 0),
    estoque: {
      estoque_disponivel: this.getNodeParameter('estoque_disponivel', 0),
      valor_venda: this.getNodeParameter('valor_venda', 0),
      custo_medio: this.getNodeParameter('custo_medio', 0),
      estoque_minimo: this.getNodeParameter('estoque_minimo', 0),
      estoque_maximo: this.getNodeParameter('estoque_maximo', 0),
    },
    dimensao: {
      altura: this.getNodeParameter('altura', 0),
      largura: this.getNodeParameter('largura', 0),
      profundidade: this.getNodeParameter('profundidade', 0),
    },
  };

  const response = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'POST',
    url: 'https://api-v2.contaazul.com/v1/produto',
    body,
    json: true,
  });

  return [{ json: response }];
}
