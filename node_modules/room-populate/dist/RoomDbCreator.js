"use strict";
/*
 * The MIT License (MIT)
 *
 * Copyright (c)  2020. Nikolai Kotchetkov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDbCreator = void 0;
class RoomDbCreator {
    /**
     * Creates
     * @param {Schema} schema Schema definition
     * @param db Created database
     */
    constructor(schema, db) {
        this.schema = schema;
        this.db = db;
    }
    /**
     * Runs setup queries
     */
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schema.database.setupQueries.reduce((soFar, query) => soFar.then(() => this.executeCreationSql(query)), Promise.resolve());
        });
    }
    /**
     * Creates table structure
     */
    createTables() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schema.database.entities.reduce((soFar, entity) => soFar.then(() => this.createTable(entity)), Promise.resolve());
        });
    }
    /**
     * Populates database with data
     * @param block Populating block
     */
    populate(block) {
        return __awaiter(this, void 0, void 0, function* () {
            return block.call(this.db);
        });
    }
    /**
     * Creates database indices
     */
    createIndices() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schema.database.entities.reduce((soFar, entity) => soFar.then(() => {
                return entity.indices.reduce((soFar, index) => soFar.then(() => this.createIndex(entity, index)), soFar);
            }), Promise.resolve());
        });
    }
    /**
     * Creates database views
     */
    createViews() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.schema.database.views.reduce((soFar, view) => soFar.then(() => this.createView(view)), Promise.resolve());
        });
    }
    /**
     * Executes creation SQL
     * @param sql SQL to execute
     */
    executeCreationSql(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, function (err) {
                if (null == err) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    /**
     * Creates table using entity definition
     * @param entity Entity definition
     */
    createTable(entity) {
        return this.executeCreationSql(entity.createSql.replace("${TABLE_NAME}", entity.tableName));
    }
    /**
     * Creates table index using index definition
     * @param entity Entity definition
     * @param index Index definition
     */
    createIndex(entity, index) {
        return this.executeCreationSql(index.createSql.replace("${TABLE_NAME}", entity.tableName));
    }
    /**
     * Creates table index using index definition
     * @param view View definition
     */
    createView(view) {
        return this.executeCreationSql(view.createSql.replace("${VIEW_NAME}", view.viewName));
    }
}
exports.RoomDbCreator = RoomDbCreator;
