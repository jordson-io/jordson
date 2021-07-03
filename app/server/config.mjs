import fs from "fs";

export const gConfig = function() {

  const fileName = fs.existsSync('./.env.dev') ? './.env.dev' : './.env';

  const envFile = fs.readFileSync(fileName, "utf-8");
  const envArray = envFile.split(/\n/);
  let envData = [];

  envArray.forEach(line => {
    envData[line.split("=")[0]] = line.split("=")[1]
  })

  envData.DB_PUBLIC_COLLECTION = envData.DB_PUBLIC_COLLECTION.split(',');

  return {
    global: {
      siteName: envData.SITE_NAME,
      domain: envData.SITE_DOMAIN,
      email_admin: envData.EMAIL_ADDRESS_ADMIN,
      port: envData.SITE_PORT,
    },
    db: {
      dbName: envData.DB_NAME,
      publicCollections: envData.DB_PUBLIC_COLLECTION,
    },
    mail: {
      host: envData.EMAIL_HOST,
      port: envData.EMAIL_PORT,
      user: envData.EMAIL_USER,
      pass: envData.EMAIL_PASSWORD,
      address : {
        noreply: envData.EMAIL_ADDRESS_NOREPLY,
        site: envData.EMAIL_ADDRESS_SITE,
        contact: envData.EMAIL_ADDRESS_CONTACT,
        support: envData.EMAIL_ADDRESS_SUPPORT,
      }
    },
    mimeTypes: {
      html: "text/html",
      js: "text/javascript",
      css: "text/css",
      json: "application/json",
      png: "image/png",
      jpg: "image/jpg",
      gif: "image/gif",
      svg: "image/svg+xml",
      wav: "audio/wav",
      mp4: "video/mp4",
      woff: "application/font-woff",
      ttf: "application/font-ttf",
      eot: "application/vnd.ms-fontobject",
      otf: "application/font-otf",
      wasm: "application/wasm",
    },
  }
};

export default gConfig;