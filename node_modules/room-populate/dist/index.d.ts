import { Database } from "sqlite3";
/**
 * A template function that initializes and pre-populates a database with Room schema to use in Android application.
 * To use:
 * 1) Export your schema as described in [Room documentation](https://developer.android.com/training/data-storage/room/migrating-db-versions#export-schema)
 * 2) Run this function providing a path to schema and a new SQLite database.
 * 3) Save the result to assets as described in [Room documentation](https://developer.android.com/training/data-storage/room/prepopulate)
 *
 * The function will run the following template:
 * 1) Set-up room internals
 * 2) Create tables
 * 3) Populate tables with your `populate` script
 * 4) Create indices
 * 5) Create views
 * @param schemaPath A path to schema being created
 * @param db A fresh database
 * @param populate The function that executes database inserts
 */
export declare function populate(schemaPath: string, db: Database, populate: (this: Database) => Promise<void>): Promise<void>;
