import phantom from "phantom";
import fs from "fs";
import filenamify from "filenamify";
import { https as http } from "follow-redirects";

import linksNormas from "./links-normas.json";
import { NormaEntity } from "../service/src/model";

const normas: NormaEntity[] = [];

(async function () {
  let crawler: phantom.PhantomJS;

  try {
    crawler = await phantom.create();

    const page = await crawler.createPage();

    for (const link of linksNormas) {
      try {
        await page.open(link);

        await new Promise(r => setTimeout(r, 5000));

        const id = await page.evaluate(function () {
          return jQuery('#Codigo').parent().next().text();
        });

        const titulo = await page.evaluate(function () {
          return jQuery('#Titulo').parent().next().text();
        });

        const objetivo = await page.evaluate(function () {
          return jQuery('#Objetivo').parent().next().text();
        });

        const ics = await page.evaluate(function () {
          return jQuery('#ICSCIN').parent().next().text();
        });

        const palavrasChave = await page.evaluate(function () {
          return jQuery('#Palavras-Chave').parent().next().text();
        });

        const norma: NormaEntity = {
          id,
          titulo,
          objetivo,
          ics,
          palavrasChave: palavrasChave.trim().split('\n'),
        };

        const fileUrl = await page.evaluate(function () {
          let src = '';
          jQuery<HTMLIFrameElement>('iframe').each((i, e) => {
            if (~e.src.indexOf('docs.google.com')) {
              src = e.src;
            };
          });
          return src;
        });


        const fileId = new URL(fileUrl).pathname.split('/')[3];

        const downloadDst = buildOutPath(`${filenamify(id, { replacement: '_' })}.pdf`);
        const downloadUrl = `https://drive.google.com/u/0/uc?id=${fileId}&export=download`;

        console.log(`downloadUrl -> ${downloadUrl}`);
        console.log(`downloadDst -> ${downloadDst}`);

        await download(downloadUrl, downloadDst);

        normas.push(norma);
      } catch (e) {
        console.log(`skipping ${link} due error: ${e}`);
      }
    }

    fs.writeFileSync(buildOutPath('normas.json'), JSON.stringify(normas, null, 2));
  } catch (e) {
    console.error(e)
  } finally {
    await crawler?.exit();
    process.exit();
  }
})();

const buildOutPath = (path) => `/Users/lu20161971/workspace/gestao-normas/packages/webcrawler/out/${path}`;

async function download(url: string, dest: string) {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    const file = fs.createWriteStream(dest);
    http.get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close();
        resolve();
      });
    }).on('error', function (err) { // Handle errors
      fs.unlinkSync(dest);
      reject();
    });
  })

};