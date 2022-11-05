# Run db container instead db_test

docker-compose --profile dev up

# Connect inside of container db

docker compose exec db_test bash
mysql -uroot -proot

show databases;
use <database_name>;
