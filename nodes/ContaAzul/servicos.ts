import { IExecuteFunctions } from 'n8n-workflow';

export async function getAllServices(this: IExecuteFunctions) {
  const busca_textual = this.getNodeParameter('serviceAdditionalFields.busca_textual', 0, '') as string;
  const pagina = this.getNodeParameter('serviceAdditionalFields.pagina', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter(
    'serviceAdditionalFields.tamanho_pagina',
    0,
    10,
  ) as number;

  const qs: any = {
    pagina,
    tamanho_pagina,
  };
  if (busca_textual) {
    qs.busca_textual = busca_textual;
  }

  const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/servicos',
    qs,
    json: true,
  });
  const items = (responseData.itens || []).map((item: any) => ({
    json: item,
    pairedItem: {
      item: 0,
    },
  }));

  return items;
}

export async function getServiceById(this: IExecuteFunctions) {
  const serviceId = this.getNodeParameter('serviceId', 0) as string;
  const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: `https://api-v2.contaazul.com/v1/servicos/${serviceId}`,
    json: true,
  });

  return [
    {
      json: responseData,
      pairedItem: {
        item: 0,
      },
    },
  ];
}

export async function createService(this: IExecuteFunctions) {
  const descricao = this.getNodeParameter('descricao', 0) as string;

  const body: any = {
    descricao,
  };

  const codigo = this.getNodeParameter('serviceCreateAdditionalFields.codigo', 0, '') as string;
  if (codigo) {
    body.codigo = codigo;
  }

  const custo = this.getNodeParameter('serviceCreateAdditionalFields.custo', 0, 0) as number;
  if (custo) {
    body.custo = custo;
  }

  const preco = this.getNodeParameter('serviceCreateAdditionalFields.preco', 0, 0) as number;
  if (preco) {
    body.preco = preco;
  }

  const status = this.getNodeParameter(
    'serviceCreateAdditionalFields.status',
    0,
    'ATIVO',
  ) as string;
  if (status) {
    body.status = status;
  }

  const tipo_servico = this.getNodeParameter(
    'serviceCreateAdditionalFields.tipo_servico',
    0,
    'PRESTADO',
  ) as string;
  if (tipo_servico) {
    body.tipo_servico = tipo_servico;
  }

  const response = await this.helpers.httpRequestWithAuthentication.call(this, 'contaAzulOAuth2Api', {
    method: 'POST',
    url: 'https://api-v2.contaazul.com/v1/servicos',
    body,
    json: true,
  });

  return [{ json: response }];
}
