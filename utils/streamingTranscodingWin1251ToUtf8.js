const { createWriteStream, createReadStream } = require('fs');
const iconv = require('iconv-lite');

function streamingTranscodingWin1251ToUtf8(fileNameFrom, fileNameTo) {
    return new Promise((resolve, reject) => {
        let data = "";
        let stream = createReadStream(fileNameFrom)
            .pipe(iconv.decodeStream('win1251'))
            .pipe(iconv.encodeStream('utf8'))
            .pipe(createWriteStream(fileNameTo));
        stream.on("error", error => reject(error));
        stream.on("data", chunk => data += chunk);
        stream.on("close", () => resolve(data));
    });
}

module.exports = streamingTranscodingWin1251ToUtf8;