const AdmZip = require("adm-zip");
const fetch = require('node-fetch');
const fileName = `${process.cwd()}/tmp/bic.zip`;
const { readFile } = require('fs/promises');
const { parseXml } = require('@rgrove/parse-xml');
const writeZipFile = require('./utils/writeZipFile');
const streamingTranscodingWin1251ToUtf8 = require('./utils/streamingTranscodingWin1251ToUtf8');

const downloadUrl = 'http://www.cbr.ru/s/newbik';

const main = async () => {
    const response = await fetch(downloadUrl);
    await writeZipFile(response, fileName);
    const zip = new AdmZip(fileName);
    const zipEntries = zip.getEntries();
    // let zipEntries = [];
    // const entryName = '20221123_ED807_full.xml';
    // zipEntries[0] = {
    //     entryName: entryName
    // }
    if (zipEntries[0].entryName.match(/\.(xml)$/)) {
        try {
            zip.extractEntryTo(zipEntries[0].entryName, `${process.cwd()}/tmp`, false, true);

            const fulPathToUTF8Xml = `${process.cwd()}/tmp/${zipEntries[0].entryName}_utf8.xml`

            await streamingTranscodingWin1251ToUtf8(`${process.cwd()}/tmp/${zipEntries[0].entryName}`, fulPathToUTF8Xml);
            const XMLdata = await readFile(fulPathToUTF8Xml, 'utf8');
            const result = parseXml(XMLdata);
            const resultData = result.children[0].children.filter((v) => {
                return (typeof v.children[1] !== 'undefined')
            }).map((v) => {
                return {
                    bic: v.attributes.BIC,
                    name: v.children[0].attributes.NameP,
                    corrAccount: v.children[1].attributes.Account
                }
            })
            return resultData
        } catch (err) {
            console.log(err)
        }
    }
}

(async function start() {
    const result = await main();
    console.log(result);
})();


