#!/bin/sh

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

echo $DIR

docker rm -f <%= dockerName %>_api
docker rm -f <%= dockerName %>_mongo
docker-compose rm

docker-compose build <%= dockerName %>_api
WEB_ID=$(docker-compose up -d <%= dockerName %>_api)

docker-compose build <%= dockerName %>_mongo
DB_ID=$(docker-compose up -d <%= dockerName %>_mongo)

sleep 3

docker exec -it <%= dockerName %>_api sh /start_script.sh
docker exec -it <%= dockerName %>_mongo sh /start_script.sh

sleep 3

docker exec -it <%= dockerName %>_api composer install

