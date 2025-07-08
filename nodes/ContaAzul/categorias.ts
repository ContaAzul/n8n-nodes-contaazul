import { IExecuteFunctions } from 'n8n-workflow';

export async function getCategories(this: IExecuteFunctions) {
	const busca = this.getNodeParameter('busca_categoria', 0, '') as string;
	const tipo = this.getNodeParameter('tipo_categoria', 0, 'RECEITA') as string;
	const pagina = this.getNodeParameter('pagina_categoria', 0, 1) as number;
	const tamanho_pagina = this.getNodeParameter('tamanho_pagina_categoria', 0, 10) as number;

	const qs: any = {
		pagina,
		tamanho_pagina,
		tipo,
	};
	if (busca) {
		qs.busca = busca;
	}

	const responseData = await this.helpers.requestOAuth2?.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'GET',
			url: 'https://api-v2.contaazul.com/v1/categorias',
			qs,
			json: true,
		}
	);
	return this.helpers.returnJsonArray(responseData);
}
