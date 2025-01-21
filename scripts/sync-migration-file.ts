import * as fs from 'node:fs'
import path from 'node:path';

const getPrismaMigrateFiles = () => {
    const dirs = fs.readdirSync(path.join(__dirname, '../prisma/migrations'), { withFileTypes: true }).filter(dir => dir.isDirectory()).map(dir => dir.name);

    return Array.from([...dirs]).map((dir, index) => {
        const file = fs.readFileSync(path.join(__dirname, `../prisma/migrations/${dir.toString()}/migration.sql`));
        return { file, fileName: `${(index + 1).toString().padStart(4, '0')}_${dir.toString().replace(/^[0-9]+_/g, '')}` };
    })
}

const files = getPrismaMigrateFiles();
for (const file of files) {
    fs.writeFileSync(path.join(__dirname, `../migrations/${file.fileName}.sql`), file.file);
}

