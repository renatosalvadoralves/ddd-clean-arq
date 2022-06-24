FROM node:14.17.0-slim

RUN npm install -g @nestjs/cli@8.2.5 npm@8.5.5

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]



