# n8n-nodes-contaazul

This is an n8n community node that allows integration with the Conta Azul API in your workflows.

Conta Azul is a business management platform that offers solutions for financial control, sales, products, services, and customer management. This node allows you to automate operations such as sales searches, product creation, customer management, and financial queries.

[n8n](https://n8n.io/) is a workflow automation platform with [fair-code license](https://docs.n8n.io/reference/license/).

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Services

- **Search service by filter**: Lists services with text search filters and pagination
- **Search service by ID**: Gets details of a specific service

### Sales

- **Search sale by filter**: Lists sales with text search filters and pagination
- **Search sale by ID**: Gets details of a specific sale
- **Create sale**: Creates a new sale with items, customer, and payment method

### People - Customers/Suppliers

- **Search people by filter**: Lists customer/supplier people with search filters
- **Search person by ID**: Gets details of a specific person
- **Create person**: Creates a new customer/supplier person

### Products

- **Search products by filter**: Lists products with search filters
- **Create product**: Creates a new product

### Financial

- **Search financial accounts**: Lists all financial accounts
- **Search revenues by filter**: Lists revenues with filters
- **Search expenses by filter**: Lists expenses with filters
- **Search installment by ID**: Gets details of a specific installment
- **Search categories**: Lists all available categories
- **Search cost centers**: Lists all cost centers

## Credentials

To use this node, you need a Conta Azul account and configure OAuth2 credentials.

### Prerequisites

1. Have an active Conta Azul account
2. Access the Conta Azul developer panel
3. Create an application to get the Client ID and Client Secret

### Credential Configuration

1. In n8n, go to **Settings** > **Credentials**
2. Click **Add Credential**
3. Select **Conta Azul OAuth2 API**
4. Fill in the fields:
   - **Client ID**: Your Conta Azul Client ID
   - **Client Secret**: Your Conta Azul Client Secret
   - **Scope**: `openid profile aws.cognito.signin.user.admin` (default)
   - **Auth URL**: `https://auth.contaazul.com/oauth2/authorize` (default)
   - **Token URL**: `https://auth.contaazul.com/oauth2/token` (default)
5. Click **Save** and authorize the application

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested versions**: 1.0.0, 1.1.0, 1.2.0
- **Node.js**: >=20.15

## Usage

### Example: Search Recent Sales

1. Add the **Conta Azul** node to your workflow
2. Configure credentials
3. Select the **Search sale by filter** operation
4. Configure search parameters (optional)
5. Execute the workflow

### Example: Create a New Sale

1. Add the **Conta Azul** node to your workflow
2. Configure credentials
3. Select the **Create sale** operation
4. Fill in required data:
   - Customer ID
   - Payment method
   - Sale items
5. Execute the workflow

### Example: Sync Products

1. Use the **Conta Azul** node with **Search products by filter** operation
2. Connect with other nodes to process data
3. Use webhooks for automatic synchronization

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Conta Azul API Documentation](https://developers.contaazul.com/guide)
- [Conta Azul Developer Portal](https://developers-portal.contaazul.com)
- [Try n8n](https://docs.n8n.io/try-it-out/)

## Version History

### v0.3.2

- Fixed n8n-workflow dependency configuration
- Removed postinstall script
- Removed resolutions and overrides
- Updated to latest n8n-workflow version

### v0.3.1

- Initial implementation of the node
- Support for basic operations: search services, sales, people, products, categories, cost centers, and financial
- Integration with Conta Azul OAuth2
