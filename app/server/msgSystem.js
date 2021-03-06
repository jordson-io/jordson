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

  console.log(style, `[${dateTime()}]${type} ${msg}`, "\x1b[0m");
}
