# medical-equipment-tracker

## Prerequisites

* local DNS service to be able to access the webserver by its name `docs/bind/README.md`

* a local email messaging system in place e.g. Postfix, Dovecot, PostfixAdmin, Roundcube (please see this series of tutorials from linuxbabe.com [Build Your Own Email Server on Ubuntu: Basic Postfix Setup](https://www.linuxbabe.com/mail-server/setup-basic-postfix-mail-sever-ubuntu))

* https setup for the local services `docs/certificates/README.md`

* NGINX webserver `docs/nginx/README.md`

## Environment variables

You need to create two environment files into the root folder of the project, `.env.development.local` and `.env.production.local` having the following structure:

```bash
HASURA_POSTGRES_USER=<your_user>
HASURA_POSTGRES_PASSWORD=<your_password>
HASURA_POSTGRES_PORT=5432
HASURA_POSTGRES_PORTS="5432:5432"
HASURA_GRAPHQL_ENABLE_CONSOLE="false"
HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
HASURA_GRAPHQL_ADMIN_PORTS="8080:8080"
HASURA_GRAPHQL_ADMIN_SECRET=<your_secret>
AUTHENTICATION_DB_NAME="authentication"
AUTHENTICATION_EXPRESS_PORT=<port_number>
```