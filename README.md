# Turret

An open authentication and authorisation platform.

## Features

### Registration

<a href="./docs/screenshots/register.png">
  <img src="./docs/screenshots/register.png" alt="registration form with name, email, password, and password repeat fields" width="300">
</a>

- Form
- Validation
- Persistance to DynamoDB
  - Generating a UUID identifier for every user

## Getting Started

Clone the repo:

```
git clone git@github.com:rosswilson/turret.git
cd turret
```

Follow [this AWS guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) to run a local DynamoDB server.

Start the DynamoDB server:

`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`

Create a `Users` table in DynamoDB:

```
aws --endpoint-url http://localhost:8000 dynamodb create-table \
    --table-name Users \
    --attribute-definitions AttributeName=Identifier,AttributeType=S \
    --key-schema AttributeName=Identifier,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

Use the default configuration, suitable for local development:

`cp .env.dist .env`

Install the npm dependencies:

`yarn`

Run the tests to confirm you're all set up:

`yarn test`

Run the local development server:

`yarn watch`

Open the application in your browser at [http://localhost:3000](http://localhost:3000)

## Architecture

TODO

## Testing

TODO

## Deployment

TODO

## License

Released under the MIT license.
