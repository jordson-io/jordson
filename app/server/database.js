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

import mongodb from "mongodb";
import logSys from "../env/msgSystem.js";
import loadConfig from "./loadConfig.mjs";

let gConfig = new loadConfig();

/**
 * Manage mongoDB database
 * @class
 */
export default class Database {
  /**
   * Prepare mongoDB instance
   * @constructor
   */
  constructor() {
    try {
      this.uri = `mongodb://127.0.0.1:27017/?authSource=${gConfig.db.dbName}&readPreference=primary&ssl=false`;
      this.name = gConfig.db.dbName;
      this.connection().then();
    } catch (error) {
      logSys(error, "error");
      return error;
    }
  }

  /**
   * Connection to mongoDB
   * @method
   * @returns {Promise<void>} a MongoClient instance
   */
  async connection() {
    try {
      let MongoClient = mongodb.MongoClient;
      this.client = new MongoClient(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await this.client.connect();
      this.db = this.client.db(this.name);
    } catch (error) {
      logSys(error, "error");
      return error;
    }
  }

  /**
   * Get all documents in targeted collection into Array [MongoDB]
   * @method
   * @param {string} [collection] targeted
   * @returns {Promise<Array>} Get all documents in collection
   */
  async getCollection(collection) {
    try {
      return await this.db.collection(collection).find().toArray();
    } catch (error) {
      logSys(error, "error");
      return error;
    }
  }

  /**
   * Add new document in specific collection [MongoDB]
   * @method
   * @param {string} [collection] targeted
   * @param {object} [primaryKey] ex: {key: value} to check if document already exist
   * @param {object} [fields] to create new document
   * @returns {Promise<string>} message for error or success
   */
  async createDocument(collection, primaryKey, fields) {
    try {
      this.document = await this.db.collection(collection).find(primaryKey);
      if (this.document.length !== undefined) {
        return "already existing document";
      } else {
        await this.db.collection(collection).insertOne(fields, (error) => {
          if (error) logSys(error, "error");
          logSys(`Document ADD with success in ${collection}`, "success");
        });
        return "create document";
      }
    } catch (error) {
      logSys(error, "error");
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
  async editDocument(collection, primaryKey, fields) {
    try {
      console.log(fields);
      await this.db.collection(collection).updateOne(primaryKey, { $set: JSON.parse(fields) });
      await logSys(`Document EDIT with success in ${collection}`, "success");
      return "edited document";
    } catch (error) {
      logSys(error, "error");
    }
  }

  /**
   * Get document on specific collection [MongoDB]
   * @method
   * @param {string} [collection] targeted
   * @param {object} [primaryKey] ex: {key: value} to find document
   * @returns {Promise<string|*>}
   */
  async getDocument(collection, primaryKey) {
    try {
      this.document = await this.db.collection(collection).find(primaryKey).toArray();
      return this.document[0] === undefined ? "document not found" : this.document[0];
    } catch (error) {
      logSys(error, "error");
    }
  }
}
