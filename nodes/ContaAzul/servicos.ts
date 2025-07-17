import { IExecuteFunctions } from 'n8n-workflow';

export async function getAllServices(this: IExecuteFunctions) {
  const busca_textual = this.getNodeParameter('busca_textual', 0, '') as string;
  const pagina = this.getNodeParameter('pagina', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter('tamanho_pagina', 0, 10) as number;

  const qs: any = {
    pagina,
    tamanho_pagina,
  };
  if (busca_textual) {
    qs.busca_textual = busca_textual;
  }

  const responseData = await this.helpers.requestOAuth2?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/servicos',
    qs,
    json: true,
  });
  return this.helpers.returnJsonArray(responseData.itens);
}

export async function getServiceById(this: IExecuteFunctions) {
  const serviceId = this.getNodeParameter('serviceId', 0) as string;
  const responseData = await this.helpers.requestOAuth2?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: `https://api-v2.contaazul.com/v1/servicos/${serviceId}`,
    json: true,
  });
  return this.helpers.returnJsonArray([responseData]);
}
