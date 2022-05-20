SWCCG Decks Server
==================

## Roadmap

* [The roadmap of current and planned work is available on GitHub.](https://github.com/swccgpc/swccgdb/projects/1)

## Code
* Forked from [ThronesDB](https://github.com/ThronesDB/thronesdb), which powers [ThronesDB.com](https://thronesdb.com)
* Adapted for use with StarWars CCG by [Preston Stahley](https://github.com/PrestonStahley)

## JSON formatted card data

* Card data sourced from [swccg card json database](https://github.com/swccgpc/swccg-card-json).
* The `json` files can not be loaded directly, they must be converted to the `ThronesDB` format.

### Create swccgdb card data

```bash
git clone git@github.com:swccgpc/swccg-card-json.git
cd swccg-card-json
./make_swccgdb_json.py
```

### Import swccgdb card data

```bash
./bin/console app:import:std ./swccg-card-json/swccgdb_json/
```



## Dev setup:

### Start MariaDB server using Docker

```bash
docker run -d \
  -p 3306:3306 \
  --name mariadb \
  -e MYSQL_ROOT_PASSWORD=swccgdb \
  -e MYSQL_DATABASE=swccgdb \
  -e MYSQL_USER=swccgdb_user \
  -e MYSQL_PASSWORD=swccgdb \
  -d mariadb:latest
```

### Install Composer for PHP

```bash
brew install composer
```

### Use Composer to setup DB
```bash
composer install
# ./bin/console doctrine:database:create
./bin/console doctrine:schema:create
./bin/console app:import:std ../swccg-card-json/swccgdb_json/

./bin/console server:run
```

## Run Production Server

### Clear Production Cache:

```bash
./bin/console cache:clear --env=prod --no-debug
./bin/console cache:warmup --env=prod --no-debug
```
### Start Server

```bash
./bin/console server:run --env=prod --no-debug
```



## Symfony commands

- run `composer install` to install PHP dependencies
- run `npm install` to install JS dependencies
- run `php bin/console doctrine:database:create` to create the database
- run `php bin/console doctrine:migrations:migrate` to create the database schema
- run `php bin/console doctrine:fixtures:load --env=prod` to load default application data
- run `php bin/console app:import:std ../throneteki-json-data` or whatever the path to the data repository is to load cards and packs data
- run `php bin/console app:restrictions:import ../throneteki-json-data` or whatever the path to the data repository is to load restricted lists
- run `php bin/console app:restrictions:activate` to activate any restricted lists that apply
- run `php bin/console bazinga:js-translation:dump assets/js` to export translation files for the frontend
- run `php bin/console fos:js-routing:dump --target=public/js/fos_js_routes.js` to export routes for the frontend
- run `gulp` to build web assets

## Setup an admin account

- register (or run `php bin/console fos:user:create <username>`)
- make sure your account is enabled (or run `php bin/console fos:user:activate <username>`)
- run `php bin/console fos:user:promote --super <username>`
