import { IExecuteFunctions } from 'n8n-workflow';

export async function getPersonsByFilter(this: IExecuteFunctions) {
	const termo_busca = this.getNodeParameter('termo_busca', 0, '') as string;
	const pagina = this.getNodeParameter('pagina_pessoa', 0, 1) as number;
	const tamanho_pagina = this.getNodeParameter('tamanho_pagina_pessoa', 0, 10) as number;

	const qs: any = {
		pagina,
		tamanho_pagina,
	};
	if (termo_busca) {
		qs.termo_busca = termo_busca;
	}

	const responseData = await this.helpers.requestOAuth2?.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'GET',
			url: 'https://api-v2.contaazul.com/v1/pessoa',
			qs,
			json: true,
		}
	);
	return this.helpers.returnJsonArray(responseData);
}

export async function getPersonById(this: IExecuteFunctions) {
	const personId = this.getNodeParameter('personId', 0) as string;
	const responseData = await this.helpers.requestOAuth2?.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'GET',
			url: `https://api-v2.contaazul.com/v1/pessoa/${personId}/resumo`,
			json: true,
		}
	);
	return this.helpers.returnJsonArray([responseData]);
}

export async function createPerson(this: IExecuteFunctions) {
	const tipoPessoa = this.getNodeParameter('tipo_pessoa', 0);
	const tipoPerfilParam = this.getNodeParameter('tipo_perfil', 0);
	const perfisArray = Array.isArray(tipoPerfilParam) ? tipoPerfilParam : [tipoPerfilParam];
	const body: any = {
		tipo_pessoa: tipoPessoa,
		nome: this.getNodeParameter('nome', 0),
		email: this.getNodeParameter('email', 0),
		telefone: this.getNodeParameter('telefone', 0),
		
		enderecos: [
			{
				cep: this.getNodeParameter('cep', 0),
				logradouro: this.getNodeParameter('logradouro', 0),
				numero: this.getNodeParameter('numero', 0),
				complemento: this.getNodeParameter('complemento', 0),
				bairro: this.getNodeParameter('bairro', 0),
				cidade: this.getNodeParameter('cidade', 0),
				estado: this.getNodeParameter('estado', 0),
				pais: this.getNodeParameter('pais', 0),
			},
		],
		perfis: perfisArray.map((perfil) => ({ tipo_perfil: perfil })),
	};

	if (tipoPessoa === 'FISICA') {
		body.cpf = this.getNodeParameter('cpf', 0, null);
	}
	if (tipoPessoa === 'JURIDICA') {
		body.cnpj = this.getNodeParameter('cnpj', 0, null);
	}

	const response = await this.helpers.requestOAuth2.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'POST',
			url: 'https://api-v2.contaazul.com/v1/pessoa',
			body,
			json: true,
		}
	);

	return [{ json: response }];
}
