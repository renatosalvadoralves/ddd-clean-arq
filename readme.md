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

    Ex: `npm run migrate -w mycore pending`

-   UP

    Ex: `npm run migrate -w mycore up`

-   DOWN

    Ex: `npm run migrate -w mycore down`
