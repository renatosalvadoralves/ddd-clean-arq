#!/bin/bash

if [ ! -f "./src/@core/.env.testing" ]; then
    cp ./src/@core/.env.testing.example ./src/@core/.env.testing
fi

npm install

tail -f /dev/null

#npm run start:dev