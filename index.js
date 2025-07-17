'use strict';

module.exports = {
  nodes: [
    require('./dist/nodes/ContaAzul/ContaAzul.node.js'),
  ],
  credentials: [
    require('./dist/credentials/ContaAzulOAuth2Api.credentials.js'),
  ],
};
