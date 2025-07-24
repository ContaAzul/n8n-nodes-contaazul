import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ContaAzulOAuth2Api implements ICredentialType {
  name = 'contaAzulOAuth2Api';
  displayName = 'Conta Azul OAuth2 API';
	documentationUrl = 'https://developers.contaazul.com/auth';
  extends = ['oAuth2Api'];
  properties: INodeProperties[] = [
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
						typeOptions: { password: true },
      default: '',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default: 'openid profile aws.cognito.signin.user.admin',
    },
    {
      displayName: 'Auth URL',
      name: 'authUrl',
      type: 'string',
      default: 'https://auth.contaazul.com/oauth2/authorize',
    },
    {
      displayName: 'Token URL',
      name: 'tokenUrl',
      type: 'string',
      default: 'https://auth.contaazul.com/oauth2/token',
    },
  ];
}
