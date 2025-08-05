import { ContaAzul } from '../nodes/ContaAzul/ContaAzul.node';

describe('ContaAzul Node', () => {
  let node: ContaAzul;

  beforeEach(() => {
    node = new ContaAzul();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(node.description.displayName).toBe('Conta Azul API');
    });

    it('should have correct name', () => {
      expect(node.description.name).toBe('contaAzul');
    });

    it('should have correct description', () => {
      expect(node.description.description).toBe('Allows making requests to the Conta Azul API');
    });

    it('should have correct icon', () => {
      expect(node.description.icon).toBe('file:contaazul.svg');
    });

    it('should have correct group', () => {
      expect(node.description.group).toEqual(['transform']);
    });

    it('should have correct version', () => {
      expect(node.description.version).toBe(1);
    });

    it('should have correct credentials', () => {
      expect(node.description.credentials).toEqual([
        {
          name: 'contaAzulOAuth2Api',
          required: true,
        },
      ]);
    });

    it('should have correct inputs and outputs', () => {
      expect(node.description.inputs).toEqual(['main']);
      expect(node.description.outputs).toEqual(['main']);
    });
  });

  describe('Node Properties', () => {
    it('should have operation property', () => {
      const operationProperty = node.description.properties.find(
        (prop) => prop.name === 'operation'
      );
      expect(operationProperty).toBeDefined();
      expect(operationProperty?.displayName).toBe('Operation');
      expect(operationProperty?.type).toBe('options');
    });

    it('should have all required operations', () => {
      const operationProperty = node.description.properties.find(
        (prop) => prop.name === 'operation'
      );
      const expectedOperations = [
        'getAllServices',
        'getServiceById',
        'getSalesByFilter',
        'getSaleById',
        'getPersonsByFilter',
        'getPersonById',
        'getCostCenters',
        'getCategories',
        'getFinancialAccounts',
        'getProductsByFilter',
        'getRevenuesByFilter',
        'getExpensesByFilter',
        'getInstallmentById',
        'createProduct',
        'createPerson',
        'createSale',
      ];

      if (operationProperty && 'options' in operationProperty) {
        const actualOperations = operationProperty.options?.map((opt: any) => opt.value) || [];
        expectedOperations.forEach((operation) => {
          expect(actualOperations).toContain(operation);
        });
      }
    });
  });

  describe('Node Instance', () => {
    it('should be an instance of ContaAzul', () => {
      expect(node).toBeInstanceOf(ContaAzul);
    });

    it('should have execute method', () => {
      expect(typeof node.execute).toBe('function');
    });
  });
}); 