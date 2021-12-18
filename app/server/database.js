'use strict';
/** Copyright © 2021 André LECLERCQ
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import crypto from "crypto";
import { createClient } from "redis";
import { log } from "../env/logSystem.js";
import loadConfig from "./loadConfig.mjs";

const gConfig = new loadConfig();

/**
 * Manage Redis database
 * @class
 */
export default class Database {
  /**
   * Prepare Redis instance
   * @constructor
   */
  constructor() {
    try {
      this.client = createClient();
      this.client.on('error', (err) => log.error(err));

      this.connection().then();
    } catch (error) {
      log.error(error);
      return error;
    }
  }

  /**
   * Connection to Redis
   * @method
   * @returns {Promise<void>} a Redis instance
   */
  async connection() {
    try {
      await this.client.connect();

      await this.getDocument('pages', {fileName: "home"});
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      return error;
    }
  }

  /**
   * Get all documents in targeted collection into Array [Redis]
   * @method
   * @param {string} [collection] targeted
   * @returns {Promise<Array>} Get all documents in collection
   */
  async getCollection(collection) {

    try {
      const isPublicCollection = () => { gConfig.db.publicCollections.includes(collection) };

      if( isPublicCollection() ) {
        let datas = [];
        for await (const key of this.client.scanIterator()) {
          if(key.startsWith(`${ collection }:`)) {
            datas.push(JSON.stringify(await this.client.hGetAll(key)));
          }
        }
        return datas;
      } else {
        log.error("This collection doesn't exist");
      }
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      return error;
    }
  }

  /**
   * Add new document in specific collection [Redis]
   * @method
   * @param {string} [collection] targeted
   * @param {object} [primaryKeyValue] ex: {key: value} to check if document already exist
   * @param {object} [fields] to create new document
   * @returns {Promise<string>} message for error or success
   */
  async createDocument(collection, primaryKeyValue, fields = null) {
    try {
      const document = await this.getDocument(collection, primaryKeyValue)

      if (document) {
        return "already existing document";
      } else {
        const result = await this.db.collection(collection).upsert( crypto.randomUUID(), fields );
        if(result){
          log.success(`Document ADD with success in ${collection}`);
          return "create document"
        }
      }

    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
      return error;
    }
  }

  /**
   * Edit one document in specific collection [MongoDB]
   * @method
   * @param {string} [collection] targeted
   * @param {object} [primaryKey] ex: {key: value} to find document
   * @param {object} [fields] to edit document
   * @returns {Promise<string>} message for error or success
   */
  async editDocument(collection, primaryKeyValue, fields) {
    try {
      const document = await this.getDocument(collection, primaryKeyValue);
      if(document){
        const result = await this.db.collection(collection).upsert( document.id, fields );
        if(result){
          log.success(`Document EDIT with success in ${collection}`);
          return "edited document"
        }
      }
    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
    }
  }

  /**
   * Get document on specific collection [Redis]
   * @method
   * @param {string} [collection] targeted
   * @param {object} [primaryKeyValue] ex: {key: value} to find document
   * @returns {Promise<string|*>}
   */
  async getDocument(collection, primaryKeyValue) {
    try {
      let primKey, primValue
      for (const key in primaryKeyValue) {
        if (Object.hasOwnProperty.call(primaryKeyValue, key)) {
          primValue = primaryKeyValue[key];
          primKey = key;
        }
      }

      /**for await (const key of this.client.scanIterator()) {
        if(key.startsWith(`${ collection }:`)) {
          const document = await this.client.HSET(key, primKey, primValue);
          log.debug(JSON.stringify(document));
        }
      }*/

      const results = await this.client.json.get('pages:jsondata', '$');

      console.log(results);

      //this.document = await this.db.query(`SELECT META().id, * FROM ${collection} WHERE ${primKey} = "${primValue}"`);
      //return this.document.meta.metrics.resultCount === 0 ? null : this.document.rows[0];

    } catch (error) {
      log.error(error.message);
      log.error(error.stack);
    }
  }
}
