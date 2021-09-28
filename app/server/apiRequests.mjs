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

import Form from "./form.js";
import Email from "./email.js";
import Database from "./database.js";
import loadConfig from "./loadConfig.mjs";
import logSys from "../env/msgSystem.js";

export const apiRoutes = {
    "get": "./app/server/apiRequests.mjs",
    "sendEmail": "(await import('./app/server/apiRequests.mjs')).sendEmail",
    "formProcessing": "(await import('./app/server/apiRequests.mjs')).formProcessing"
}

const db = new Database();
const gConfig = new loadConfig();


/**
 * Get public collection
 * @function
 * @param {*} req 
 * @param {*} res 
 */
export async function get(req) {

    if(gConfig.db.publicCollections.some(elt => elt === req.param.name))
        return await db.getCollection(req.param.name)

}

/**
 * Send email
 * @function
 * @param {*} req 
 * @param {*} res 
 */
export async function sendEmail(req, res) {

    let email = new Email();
    console.log(JSON.parse(req.body))
    return await email.send(JSON.parse(req.body))
}

/**
 * Form Processing
 * @function
 * @param {*} req 
 * @param {*} res 
 */
export async function formProcessing(req, res) {

    let formData = JSON.parse(req.body)
    let form = new Form(formData.id);
    return JSON.stringify(await form.check(formData))

}
