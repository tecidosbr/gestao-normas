import { ShareServiceClient } from '@azure/storage-file-share';

import fs from 'fs';
import dotenv from 'dotenv-flow';

(async () => {
    try {
        dotenv.config();

        const serviceClient = ShareServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

        const containerClient = serviceClient.getShareClient('gestao-normas');
        const directoryClient = containerClient.getDirectoryClient('norma');

        const dir = '/Users/lu20161971/workspace/gestao-normas/packages/webcrawler/out';

        for (const filaname of fs.readdirSync(dir)) {
            const fileClient = directoryClient.getFileClient(filaname);
            await fileClient.uploadFile(`${dir}/${filaname}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
