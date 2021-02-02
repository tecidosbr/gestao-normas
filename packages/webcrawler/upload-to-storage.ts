import { BlobServiceClient as ServiceClient } from '@azure/storage-blob';

import fs from 'fs';
import dotenv from 'dotenv-flow';

(async () => {
    try {
        dotenv.config();

        const serviceClient = ServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

        const containerClient = serviceClient.getContainerClient('gestao-normas');

        const dir = '/Users/lu20161971/workspace/gestao-normas/packages/webcrawler/out';

        for (const filaname of fs.readdirSync(dir)) {
            const fileClient = await containerClient.getBlockBlobClient(filaname);
            await fileClient.deleteIfExists();
            await fileClient.uploadFile(`${dir}/${filaname}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
