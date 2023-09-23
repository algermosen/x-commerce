<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

![Static Badge](https://img.shields.io/badge/Node%20-%20v18.16.1%20-%20green)

![Static Badge](https://img.shields.io/badge/pnpm%20-%20v7.22.0%20-%20rgb(252%2C%20154%2C%2051))


## Description

[Nest](https://github.com/nestjs/nest) e-commerce api.

__Learnings__

- [pnpm](https://pnpm.io/) as a project package manager
- Create PostgreSQL database using Docker
- Use of @BeforeInsert and @BeforeUpdate typeorm decorators
- Add a simple logger to a service
- CRUD methods within the Repository pattern on typeorm
- Create relationships with typeorm
- Save entities with its relationships

## Stack

- NestJs
- PostgreSQL

## Installation

This project use Docker to deploy local databases and pnpm as package manager.

1. Install dependencies
```bash
$ pnpm install
```

2. Clone __.env.template__ and rename it to __.env__, then add environment variables
   

3. Start database
```bash
docker-compose up -d
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
