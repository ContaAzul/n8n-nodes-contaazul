// Configurações globais para os testes
import { jest } from '@jest/globals';

// Mock do n8n-workflow para testes
jest.mock('n8n-workflow', () => ({
  IExecuteFunctions: jest.fn(),
  INodeType: jest.fn(),
  INodeTypeDescription: jest.fn(),
  NodeConnectionType: {
    Main: 'main',
  },
  ICredentialType: jest.fn(),
  INodeProperties: jest.fn(),
}));

// Configurações globais
global.console = {
  ...console,
  // Suprimir logs durante os testes
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 