#!/bin/bash

#### @core configs ####
echo "#### Starting @core configs ####"
if [ ! -f "./src/@core/.env.test" ]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

#### nestjs configs ####
echo "#### Starting nestjs configs ####"
if [ ! -f "./src/nestjs/envs/.env" ]; then
    cp ./src/nestjs/envs/.env.example ./src/nestjs/envs/.env
fi

if [ ! -f "./src/nestjs/envs/.env.test" ]; then
    cp ./src/nestjs/envs/.env.test.example ./src/nestjs/envs/.env.test
fi

if [ ! -f "./src/nestjs/envs/.env.e2e" ]; then
    cp ./src/nestjs/envs/.env.e2e.example ./src/nestjs/envs/.env.e2e
fi


npm install

echo "#### Starting build @core ####"
npm run build -w mycore

tail -f /dev/null

#npm run start:dev