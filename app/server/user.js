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

import argon2 from "argon2";
import { log } from "/app/env/logSystem.js";
import Database from "./database.js";

let db = new Database();

/**
 * Manage User
 * @class
 */
export default class User {
  /**
   * Create new user
   * @method
   * @param {object} [data] to insert into database
   * @returns {Promise<object>} created data
   */
  async createUser(data) {
    try {
      data.password = await argon2.hash(data.password);
      return await db.createDocument("users", { email: data.email }, data);
    } catch (error) {
      await log.error(error);
      return error;
    }
  }

  /**
   * Edit user infos
   * @method
   * @param {object} [data] to edit into database
   * @returns {Promise<object>} edited data
   */
  async editUser(data) {
    try {
      return await db.editDocument("users", { email: data.email }, data);
    } catch (error) {
      await log.error(error);
      return error;
    }
  }

  /**
   * Edit & hash password
   * @method
   * @param {object} [data] email, old and new password
   * @returns {Promise<string|*>} success or error message
   */
  async editPwd(data) {
    try {
      this.document = await db.getDocument("users", { email: data.email });
      return (await argon2.verify(this.document.password, data.password))
        ? await db.editDocument("users", { email: data.email }, { password: await argon2.hash(data.newPassword) })
        : "old password invalid";
    } catch (error) {
      await log.error(error);
      return error;
    }
  }

  /**
   * Login user and return token auth
   * @method
   * @param {object} [data] email & password
   * @returns {Promise<string|*>} token or error message
   */
  // TODO: Créer un object "public" dans le document utilisateur pour acceuillir toutes les données que le serveur pourra
  //  renvoyer au client afin d'éviter de modifier en dure les champs autorisé à être renvoyés au client.
  async login(data) {
    try {
      this.document = await db.getDocument("users", { email: data.email });
      if (typeof this.document === "object") {
        if (await argon2.verify(this.document.password, data.password)) {
          log.sys(`User login "${this.document._id}"`);
          return this.document.public;
        } else return "password incorrect";
      } else return this.document;
    } catch (error) {
      await log.error(error);
      return error;
    }
  }
}
