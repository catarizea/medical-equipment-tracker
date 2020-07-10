# medical-equipment-tracker

## Main objective

Create an internal communication and hospital resources management system to help the medical personnel facing a flood of patients due to a hypothetical natural catastrophe.

## Prerequisites

* local DNS service to be able to access the webserver by its name `docs/bind/README.md`

* a local email messaging system in place e.g. Postfix, Dovecot, PostfixAdmin, Roundcube (please see this series of tutorials from linuxbabe.com [Build Your Own Email Server on Ubuntu: Basic Postfix Setup](https://www.linuxbabe.com/mail-server/setup-basic-postfix-mail-sever-ubuntu))

* SSL / TLS setup for the local services `docs/certificates/README.md`

* NGINX webserver `docs/nginx/README.md`

## Environment variables

You need to create two environment variables related files into the root folder of the project, `.env.development.local` and `.env.production.local` having the following structure:

```bash
HASURA_POSTGRES_USER=<your_user>
HASURA_POSTGRES_PASSWORD=<your_password>
HASURA_POSTGRES_PORT=5432
HASURA_POSTGRES_PORTS="5432:5432"
HASURA_GRAPHQL_ENABLE_CONSOLE="false"
HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
HASURA_GRAPHQL_ENDPOINT=<your_hasura_endpoint>
HASURA_GRAPHQL_ADMIN_PORTS="8080:8080"
HASURA_GRAPHQL_ADMIN_SECRET=<your_secret>
HASURA_GRAPHQL_JWT_SECRET="{"type":"HS256","key":"<your_secret_key>"}"
AUTHENTICATION_DB_NAME="authentication"
AUTHENTICATION_EXPRESS_PORT=<your_port_number>
AUTHENTICATION_EXPRESS_ENDPOINT=<your_endpoint>
AUTHENTICATION_REFRESH_TOKEN_EXPIRES=<your_number_of_minutes>
AUTHENTICATION_JWT_TOKEN_EXPIRES=<your_number_of_minutes>
AUTHENTICATION_CUSTOM_CLAIMS=""
MAILTRAP_HOST="smtp.mailtrap.io"
MAILTRAP_PORT=2525
MAILTRAP_USER=<your_mailtrap_user>
MAILTRAP_PASS=<your_mailtrap_password>
```