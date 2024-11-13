/**
 * Room database
 */
import { Schema } from "./schema/Schema";
import { Database } from "sqlite3";
export declare class RoomDbCreator {
    /**
     * Database schema
     */
    private readonly schema;
    /**
     * Database
     */
    private readonly db;
    /**
     * Creates
     * @param {Schema} schema Schema definition
     * @param db Created database
     */
    constructor(schema: Schema, db: Database);
    /**
     * Runs setup queries
     */
    setup(): Promise<void>;
    /**
     * Creates table structure
     */
    createTables(): Promise<void>;
    /**
     * Populates database with data
     * @param block Populating block
     */
    populate(block: (this: Database) => Promise<void>): Promise<void>;
    /**
     * Creates database indices
     */
    createIndices(): Promise<void>;
    /**
     * Creates database views
     */
    createViews(): Promise<void>;
    /**
     * Executes creation SQL
     * @param sql SQL to execute
     */
    private executeCreationSql;
    /**
     * Creates table using entity definition
     * @param entity Entity definition
     */
    private createTable;
    /**
     * Creates table index using index definition
     * @param entity Entity definition
     * @param index Index definition
     */
    private createIndex;
    /**
     * Creates table index using index definition
     * @param view View definition
     */
    private createView;
}
