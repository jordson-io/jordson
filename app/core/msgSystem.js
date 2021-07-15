/** Copyright © 2021 André LECLERCQ

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. **/



// Find colors in https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

import dateTime from "./dateTime.js";

/**
 * @function
 * @param msg {string}
 * @param type {string}
 */
export default function logSys(msg, type = "") {
  let style;
  switch (type) {
    case "success":
      style = "\x1b[32m";
      break;
    case "error":
      style = "\x1b[31m";
      break;
    case "warning":
      style = "\x1b[33m";
      break;
    case "info":
      style = "\x1b[34m";
      break;
    case "debug":
      style = "\x1b[46;30m";
      break;
    default:
      style = "\x1b[0m";
  }

  type = type === undefined ? "" : `[${type}]`;

  console.log(style, `[${dateTime()}]${type} ${String(msg)}`, "\x1b[0m");
}
