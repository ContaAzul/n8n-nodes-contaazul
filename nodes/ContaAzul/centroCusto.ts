import { IExecuteFunctions } from 'n8n-workflow';

export async function getCostCenters(this: IExecuteFunctions) {
  const busca = this.getNodeParameter('busca_centro', 0, '') as string;
  const filtro_rapido = this.getNodeParameter('filtro_rapido', 0, 'ATIVO') as string;
  const pagina = this.getNodeParameter('pagina_centro', 0, 1) as number;
  const tamanho_pagina = this.getNodeParameter('tamanho_pagina_centro', 0, 10) as number;

  const qs: any = {
    pagina,
    tamanho_pagina,
    filtro_rapido,
  };
  if (busca) {
    qs.busca = busca;
  }

  const responseData = await this.helpers.requestOAuth2?.call(this, 'contaAzulOAuth2Api', {
    method: 'GET',
    url: 'https://api-v2.contaazul.com/v1/centro-de-custo',
    qs,
    json: true,
  });
  return this.helpers.returnJsonArray(responseData.itens);
}
