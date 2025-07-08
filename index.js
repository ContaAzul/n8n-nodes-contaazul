console.log('TESTE N8N NODE');
const { ContaAzul } = require('./nodes/ContaAzul.node');
const { ContaAzulOAuth2Api } = require('./credentials/ContaAzulOAuth2Api.credentials');

module.exports = {
  nodes: [ContaAzul],
  credentials: [ContaAzulOAuth2Api],
};
