import { ContaAzulOAuth2Api } from '../credentials/ContaAzulOAuth2Api.credentials';

describe('ContaAzulOAuth2Api Credentials', () => {
  let credentials: ContaAzulOAuth2Api;

  beforeEach(() => {
    credentials = new ContaAzulOAuth2Api();
  });

  describe('Credentials Configuration', () => {
    it('should have correct name', () => {
      expect(credentials.name).toBe('contaAzulOAuth2Api');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Conta Azul OAuth2 API');
    });

    it('should extend oAuth2Api', () => {
      expect(credentials.extends).toEqual(['oAuth2Api']);
    });
  });

  describe('Credentials Properties', () => {
    it('should have clientId property', () => {
      const clientIdProperty = credentials.properties.find(
        (prop) => prop.name === 'clientId'
      );
      expect(clientIdProperty).toBeDefined();
      expect(clientIdProperty?.displayName).toBe('Client ID');
      expect(clientIdProperty?.type).toBe('string');
    });

    it('should have clientSecret property', () => {
      const clientSecretProperty = credentials.properties.find(
        (prop) => prop.name === 'clientSecret'
      );
      expect(clientSecretProperty).toBeDefined();
      expect(clientSecretProperty?.displayName).toBe('Client Secret');
      expect(clientSecretProperty?.type).toBe('string');
    });

    it('should have scope property with default value', () => {
      const scopeProperty = credentials.properties.find(
        (prop) => prop.name === 'scope'
      );
      expect(scopeProperty).toBeDefined();
      expect(scopeProperty?.displayName).toBe('Scope');
      expect(scopeProperty?.type).toBe('string');
      expect(scopeProperty?.default).toBe('openid profile aws.cognito.signin.user.admin');
    });

    it('should have authUrl property with correct default', () => {
      const authUrlProperty = credentials.properties.find(
        (prop) => prop.name === 'authUrl'
      );
      expect(authUrlProperty).toBeDefined();
      expect(authUrlProperty?.displayName).toBe('Auth URL');
      expect(authUrlProperty?.type).toBe('string');
      expect(authUrlProperty?.default).toBe('https://auth.contaazul.com/oauth2/authorize');
    });

    it('should have tokenUrl property with correct default', () => {
      const tokenUrlProperty = credentials.properties.find(
        (prop) => prop.name === 'tokenUrl'
      );
      expect(tokenUrlProperty).toBeDefined();
      expect(tokenUrlProperty?.displayName).toBe('Token URL');
      expect(tokenUrlProperty?.type).toBe('string');
      expect(tokenUrlProperty?.default).toBe('https://auth.contaazul.com/oauth2/token');
    });
  });

  describe('Credentials Instance', () => {
    it('should be an instance of ContaAzulOAuth2Api', () => {
      expect(credentials).toBeInstanceOf(ContaAzulOAuth2Api);
    });

    it('should have properties array', () => {
      expect(Array.isArray(credentials.properties)).toBe(true);
      expect(credentials.properties.length).toBeGreaterThan(0);
    });
  });
}); 