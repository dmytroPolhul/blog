# Blog GraphQL API

This repository contains the GraphQL API for the Blog application.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/products/docker-desktop) (For Docker-based development and testing)

## Useful Links

- [API Documentation](https://blog-docs.onrender.com/main-documentation)
- [Production GraphQL Playground](https://blog-graphql.fly.dev/graphql)

## Getting Started

### Installation

1. Install the required packages:
   ```bash
   npm install
   ```

   Alternatively, you can use the shorthand:
   ```bash
   npm i
   ```

2. Review the `.env-example` file in the root of the project. Create a `.env` file in the same location and populate it with your specific environment variables.

3. Start the application:
   ```bash
   npm run start
   ```

## Testing

### Running Tests

1. To execute the tests, run:
   ```bash
   npm run test
   ```

### Test Coverage

1. To generate a test coverage report, run:
   ```bash
   npm run test:cov
   ```

## Docker

For local testing and development using Docker:

1. Start the Docker containers:
   ```bash
   docker compose up
   ```

## Additional Information

All available commands can be found in the `scripts` section of the `package.json` file. The `.env-example` file in the root directory provides a template for environment variables.
