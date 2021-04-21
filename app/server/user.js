import argon2 from "argon2";
import logSys from "/app/core/msgSystem.js";
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
      await logSys(error, "error");
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
      await logSys(error, "error");
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
      await logSys(error, "error");
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
          logSys(`User login "${this.document._id}"`);
          return this.document.public;
        } else return "password incorrect";
      } else return this.document;
    } catch (error) {
      await logSys(error, "error");
      return error;
    }
  }
}
