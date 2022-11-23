const { createWriteStream } = require('fs');

module.exports = (response, filename) => new Promise((resolve, reject) => {
    const fileStream = createWriteStream(filename);
    response.body.pipe(fileStream);
    response.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve(true);
    });
  });