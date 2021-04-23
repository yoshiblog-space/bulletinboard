# BullletinBoard_Apps

"BulletinBoard_Apps" is a  shared contents application consists of Docker.

 

## Configuration
<img width="1325" alt="_2021-04-22_22 03 53" src="https://user-images.githubusercontent.com/75726190/115731022-c25fb580-a3c1-11eb-9b30-41fbc5cb6a48.png">


## Features

BulletinBoard used Docker compose. So if you install  Docker Desktop, you can use apps only set up some commands  [[https://github.com/zembutsu/docs.docker.jp/blob/master/compose/toc.rst](https://github.com/zembutsu/docs.docker.jp/blob/master/compose/toc.rst)]

## Requirement

docker-compose version 1.27.4

## Installation

Please confirm how to  installation  Docker compose  this page.

[https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

## Usage

### 1.Command git clone 

```
git clone [https://github.com/yoshiblog-space/bulletinboard.git](https://github.com/yoshiblog-space/bulletinboard.git)

cd bulletinboard/4push
```

### 2.Generate Enviroment File(.env)  

```
cp app.env.example app.env
```

### 3.Generate Docker Image

This run also includes the installation described Library in package json.
```
docker-compose build
```

### 4.Start up Docker Container

```
docker-compose up  -d
```

### 5.Migration of My SQL Database Using sequelize-cli
*You need to start up devlopment enviroment
```
docker-compose run --rm app npx sequelize-cli db:migrate
```

If use seed function (sample data),
```
docker-compose run --rm app npx sequelize-cli db:seed:all
```
## Note

Please make "app.env" file before execution apps, and write DB Environment 

( Please see "app.env.example")

## Author

Yoshiki Ustunomiya

Twitter: [https://twitter.com/yoshiblog_space](https://twitter.com/yoshiblog_space)

## License

"BullletinBoard_App" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
