# Turret

[![](https://github.com/rosswilson/turret/workflows/Node.js/badge.svg)](https://github.com/rosswilson/turret/actions)

An open authentication and authorisation platform.

## Features

### Registration

<a href="./docs/screenshots/register.png">
  <img src="./docs/screenshots/register.png" alt="registration form with name, email, password, and password repeat fields" width="300">
</a>

- Form validation
- Persistance to PostgreSQL
  - Generating a UUID identifier for every user
  - Downcases email address for case-insensitive searching
- Issuing of a Single Sign On token (JWT), signed with a private key

### Sign In

<a href="./docs/screenshots/sign-in.png">
  <img src="./docs/screenshots/sign-in.png" alt="sign-in form with email and password fields" width="300">
</a>

- Form validation
- Defence against timing attacks when comparing password hashes
- Issuing of a Single Sign On token (JWT), signed with a private key

### Authorization Code Flow

- Issuing an Auth Code if the user is signed in
- Redirects to Sign In page if user is not signed in
- Persists Auth Code to database, referencing the user that it belongs to

## Getting Started

Clone the repo:

```
git clone git@github.com:rosswilson/turret.git
cd turret
```

Start a local PostgreSQL server:

```
docker run \
  -d \
  --name turret-db \
  -p 5433:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=turret_dev \
  -e POSTGRES_DB=turret_dev \
  -v $(pwd)/tmp/db-data:/var/lib/postgresql/data \
  postgres:13
```

Generate a ECDSA key pair (used for signing tokens):

```
mkdir -p ./certs/signing
openssl ecparam -out certs/signing/ec_key.pem -name prime256v1 -genkey
openssl req -new -x509 -key certs/signing/ec_key.pem -out certs/signing/ec_cert.pem -days 365 -subj "/O=Turret/OU=Local Development"
```

Generate a self-signed certificate (used for HTTPS):

```
mkdir -p ./certs/tls
mkcert -cert-file ./certs/tls/turret.localhost.pem --key-file certs/tls/turret.localhost-key.pem turret.localhost
```

Update your hosts file:

`echo "127.0.0.1 turret.localhost" | sudo tee -a /etc/hosts`

Use the default configuration, suitable for local development:

`cp .env.dist .env`

Install the npm dependencies:

`yarn`

Syncronise the database to create the tables and fields:

`node scripts/syncDatabase.js`

Run the tests to confirm you're all set up:

`yarn test`

Run the local development server:

`yarn watch`

Open the application in your browser at [https://turret.localhost:3000](https://turret.localhost:3000)

## Future Development

Future development tasks are being tracked using this GitHub [project board](https://github.com/rosswilson/turret/projects/1).

## Architecture

TODO

## Testing

Run `yarn test` to run the unit tests.

Run `yarn test:e2e` to run end-to-end tests using [CodeceptJS](https://codecept.io/) in a real Chrome browser.
Tests run using HTTPS and exercise the database too.

![](./docs/e2e.gif)

## Deployment

TODO

## License

Released under the MIT license.
