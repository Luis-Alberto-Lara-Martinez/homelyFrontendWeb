import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const environmentProdTs = `export const environment = {
    production: true,
    backendUrl: "https://servidorhomely.app",
    googleClientId: '${process.env.GOOGLE_CLIENT_ID}',
    microsoftClientId: '${process.env.MICROSOFT_CLIENT_ID}'
};
`;

await writeFile(resolve(dirname(fileURLToPath(import.meta.url)), 'environment.prod.ts'), environmentProdTs, 'utf8');
