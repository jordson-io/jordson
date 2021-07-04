import fs from "fs";

export const loadConfig = function() {

  const fileName = fs.existsSync('./jordson.local.json') ? './jordson.local.json' : './jordson.json'
  return JSON.parse(fs.readFileSync(fileName, "utf-8"))

};

export default loadConfig;