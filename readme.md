# Run db container instead db_test

docker-compose --profile dev up

# Connect inside of container db

docker compose exec db_test bash
mysql -uroot -proot

show databases;
use <database_name>;

# Migrations

-   Create

        Ex: "npm run migrate -w mycore create -- --name nome-qualquer.ts --folder ."

-   Check pending

    Ex: `node_modules/.bin/ts-node src/@core/src/shared/infra/db/sequelize/migrator.ts pending`

-   UP

    Ex: `node_modules/.bin/ts-node src/@core/src/shared/infra/db/sequelize/migrator.ts up`

-   DOWN

    Ex: `node_modules/.bin/ts-node src/@core/src/shared/infra/db/sequelize/migrator.ts down`
