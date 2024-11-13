/**
 * Room database definition schema
 */
import Database = room.Database;
/**
 * Room [database schema](https://android.googlesource.com/platform/frameworks/support/+/refs/heads/androidx-master-dev/room/migration/src/main/java/androidx/room/migration/bundle)
 */
export interface Schema {
    formatVersion: number;
    database: Database;
}
/**
 * Room database schema definitions
 */
export declare namespace room {
    /**
     * Database
     */
    interface Database {
        version: number;
        identityHash: string;
        entities: Array<Entity>;
        views: Array<View>;
        setupQueries: Array<string>;
    }
    /**
     * Entity. The resulting database has a table per entity
     */
    interface Entity {
        tableName: string;
        createSql: string;
        fields: Array<Field>;
        primaryKey: PrimaryKey;
        indices: Array<Index>;
        foreignKeys: Array<ForeignKey>;
    }
    /**
     * Entity with FTS
     */
    interface FtsEntity extends Entity {
        ftsVersion: string;
        ftsOptions: FtsOptions;
        contentSyncTriggers: Array<string>;
    }
    /**
     * Table field
     */
    interface Field {
        fieldPath: string;
        columnName: string;
        affinity: string;
        notNull: boolean;
        defaultValue: string;
    }
    /**
     * Primary key definition
     */
    interface PrimaryKey {
        columnNames: Array<string>;
        autoGenerate: boolean;
    }
    /**
     * Index definition
     */
    interface Index {
        name: string;
        unique: boolean;
        columnNames: Array<string>;
        createSql: string;
    }
    /**
     * Foreign key definition
     */
    interface ForeignKey {
        table: string;
        onDelete: string;
        onUpdate: string;
        columns: Array<string>;
        referencedColumns: Array<string>;
    }
    /**
     * View
     */
    interface View {
        viewName: string;
        createSql: string;
    }
    /**
     * Options for FTS entity
     * @see FtsEntity
     */
    interface FtsOptions {
        tokenizer: string;
        tokenizerArgs: Array<string>;
        contentTable: string;
        languageIdColumnName: string;
        matchInfo: string;
        notIndexedColumns: Array<string>;
        prefixSizes: Array<number>;
        preferredOrder: string;
    }
}
