FROM node:22-bookworm-slim

WORKDIR /usr/src/app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --quiet

RUN npm rebuild better-sqlite3 --build-from-source

COPY . .

RUN npm run build

RUN mkdir -p /usr/src/app/data

CMD ["npm", "run", "start:prod"]