SWCCGDB
=======

## [swccgdb.com](https://swccgdb.com)

* This repository holds the source code.

## JSON formatted card data

* The data used by SW:CCG DB is at [swccgpc/swccgdb-json-data](https://github.com/swccgpc/swccgdb-json-data).
* If you want to fix a mistake in some card data, or add the data of a new card, you can [submit a pull request](https://github.com/swccgpc/swccgdb-json-data/pulls).

---------

## Dev setup:

```bash
## git clone https://github.com/swccgpc/swccgdb-json-data

## fork this repo
## git clone repo
## cd swccgdb
composer install
./bin/console doctrine:database:create
./bin/console doctrine:schema:create
./bin/console app:import:std /path/to/swccgdb-json-data/
## May need to fix some data inconsistencies
## for example: rename jedi-master-imperial to dark-jedi-master-imperial
./bin/console assetic:dump (or assetic:watch if editing CSS/JS)

yarn encore dev
## or, if editing ReactJS:
yarn encore dev --watch

./bin/console server:run
```

## Production Assets:

```bash
./bin/console assetic:dump --env=prod --no-debug
yarn encore production
```

## Clearing Production Cache:

```bash
./bin/console cache:clear --env=prod --no-debug
./bin/console cache:warmup --env=prod --no-debug
```

