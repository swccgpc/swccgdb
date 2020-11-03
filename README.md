SWCCGDB
=======

> **DEPRECATED** :: The PHP version of the SWCCG Database has been replaced with a new NodeJS version. Please visit the `main` branch for the NodeJS version.

## [swccgdb.com](https://swccgdb.com)

* This repository holds the source code.

## JSON formatted card data

* The data used by SW:CCG DB is at [swccgpc/swccgdb-json-data](https://github.com/swccgpc/swccgdb-json-data).
* If you want to fix a mistake in some card data, or add the data of a new card, you can [submit a pull request](https://github.com/swccgpc/swccgdb-json-data/pulls).

---------
Dev setup:

1. Clone the repo.
2. composer install
3. ./bin/console doctrine:database:create
4. ./bin/console doctrine:schema:create
5. Clone https://github.com/PrestonStahley/swccgdb-json-data
6. ./bin/console app:import:std /path/to/swccgdb-json-data/
** May need to fix some data inconsistencies (ex. jedi-master-imperial ->
dark-jedi-master-imperial)
7. ./bin/console assetic:dump (or assetic:watch if editing CSS/JS)
8. yarn encore dev (or yarn encore dev --watch if editing React JS)
9. ./bin/console server:run

Production Assets:
1. ./bin/console assetic:dump --env=prod --no-debug
2. yarn encore production
