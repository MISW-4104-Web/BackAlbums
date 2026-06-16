# BackAlbums

## Project setup

```zsh
npm install
```

## Compile and run the project

```zsh
npm run start

npm run start:dev

npm run start:prod
```

## Running in a Docker Image

Creating the image
```zsh
docker build -t backalbums .
```

Running on host machine
```zsh
docker run --rm -p 3000:3000 backalbums
```
