import { IExecuteFunctions } from 'n8n-workflow';

export async function getSalesByFilter(this: IExecuteFunctions) {
	const busca_textual = this.getNodeParameter('busca_textual_venda', 0, '') as string;
	const pagina = this.getNodeParameter('pagina_venda', 0, 1) as number;
	const tamanho_pagina = this.getNodeParameter('tamanho_pagina_venda', 0, 10) as number;

	const qs: any = {
		pagina,
		tamanho_pagina,
	};
	if (busca_textual) {
		qs.busca_textual = busca_textual;
	}

	const responseData = await this.helpers.requestOAuth2?.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'GET',
			url: 'https://api-v2.contaazul.com/v1/venda/busca',
			qs,
			json: true,
		}
	);
	return this.helpers.returnJsonArray(responseData.itens);
}

export async function getSaleById(this: IExecuteFunctions) {
	const saleId = this.getNodeParameter('saleId', 0) as string;
	const responseData = await this.helpers.requestOAuth2?.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'GET',
			url: `https://api-v2.contaazul.com/v1/venda/${saleId}`,
			json: true,
		}
	);
	return this.helpers.returnJsonArray([responseData]);
}

export async function createSale(this: IExecuteFunctions) {
	const itensRaw = this.getNodeParameter('itens', 0) as { item: any[] };
	const itens = (itensRaw.item || []).map((i) => ({
		id: i.id,
		descricao: i.descricao,
		quantidade: i.quantidade,
		valor: i.valor,
	}));

	const parcelasRaw = this.getNodeParameter('parcelas', 0) as { parcela: any[] };
	const parcelas = (parcelasRaw.parcela || []).map((p) => ({
		data_vencimento: typeof p.data_vencimento === 'string' && p.data_vencimento.includes('T')
			? p.data_vencimento.split('T')[0]
			: p.data_vencimento,
		valor: p.valor,
		...(p.descricao ? { descricao: p.descricao } : {}),
	}));

	// Validação: soma dos itens deve ser igual à soma das parcelas
	const totalItens = itens.reduce((acc, item) => acc + (item.quantidade * item.valor), 0);
	const totalParcelas = parcelas.reduce((acc, parcela) => acc + parcela.valor, 0);
	if (totalItens !== totalParcelas) {
		throw new Error(`O valor total dos itens (R$ ${totalItens}) deve ser igual ao valor total das parcelas (R$ ${totalParcelas}).`);
	}

	const opcao_condicao_pagamento = this.getNodeParameter('opcao_condicao_pagamento', 0);
	const tipo_pagamento = this.getNodeParameter('tipo_pagamento', 0);
	const condicao_pagamento = {
		opcao_condicao_pagamento,
		tipo_pagamento,
		parcelas,
	};

	let data_venda = this.getNodeParameter('data_venda', 0);
	if (typeof data_venda === 'string' && data_venda.includes('T')) {
		data_venda = data_venda.split('T')[0];
	}

	const body: any = {
		id_cliente: this.getNodeParameter('id_cliente', 0),
		numero: this.getNodeParameter('numero', 0),
		situacao: this.getNodeParameter('situacao', 0),
		data_venda,
		itens,
		condicao_pagamento,
	};

	const observacoes = this.getNodeParameter('observacoes', 0, '');
	if (observacoes) body.observacoes = observacoes;
	const observacoes_pagamento = this.getNodeParameter('observacoes_pagamento', 0, '');
	if (observacoes_pagamento) body.observacoes_pagamento = observacoes_pagamento;


	const response = await this.helpers.requestOAuth2.call(
		this,
		'contaAzulOAuth2Api',
		{
			method: 'POST',
			url: 'https://api-v2.contaazul.com/v1/venda',
			body,
			json: true,
		}
	);

	return [{ json: response }];
}
