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

// Find colors in https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

import dateTime from "./dateTime.js";

const STYLE_LOG = "\x1b[0m";
const STYLE_SUCCESS = "\x1b[32m";
const STYLE_ERROR = "\x1b[31m";
const STYLE_WARNING = "\x1b[33m";
const STYLE_INFO = "\x1b[34m";
const STYLE_DEBUG = "\x1b[46;30m";
const RESET_STYLE = "\x1b[0m";

/**
 * @function
 * @param msg {string}
 * @param type {string}
 */

 //TODO: Create methode in class or another
 export const log = {

   stringify: (message) => {
     return typeof(message) === 'string' ? message : JSON.stringify(message)
   },

   sys: (message) => {
     console.log(typeof(message))
     console.log(STYLE_LOG, `[${dateTime()}] ${log.stringify(message)}`, RESET_STYLE);
   },

   success: (message) => {
     console.log(STYLE_SUCCESS, `[${dateTime()}][success] ${log.stringify(message)}`, RESET_STYLE);
   },

   error: (message) => {
     console.log(STYLE_ERROR, `[${dateTime()}][error] ${log.stringify(message)}`, RESET_STYLE);
   },

   warning: (message) => {
     console.log(STYLE_WARNING, `[${dateTime()}][warning] ${log.stringify(message)}`, RESET_STYLE);
   },

   info: (message) => {
     console.log(STYLE_INFO, `[${dateTime()}][info] ${String(message)}`, RESET_STYLE);
   },

   debug: (message) => {
     console.log(STYLE_DEBUG, `[${dateTime()}][debug] ${String(message)}`, RESET_STYLE);
   }
 }
