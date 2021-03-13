export const gConfig = {
  global: {
    siteName: "JORDSON",
    domain: "jordson.fr",
    email_admin: "andreleclercqpro@gmail.com",
    port: 4002,
  },
  db: {
    dbName: "jrd",
    publicCollections: ["pages"],
  },
  mail: {
    host: "smtp.mailtrap.io",
    port: 2525,
    user: "0b9dfe8ea837d1",
    pass: "c890421a8e87e1",
    address : {
      noreply: "ne-pas-repondre@jordson.fr",    // Adresse pour indiquer qu'il n'y a pas de réponse possible à l'email
      site: "site@jordson.fr",                  // Adresse pour définir la provenance de l'email
      contact: "contact@jordson.fr",            // Adresse de contact général du site pour l'entreprise
      support: "support@jordson.fr",            // Adresse de support technique
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
};
