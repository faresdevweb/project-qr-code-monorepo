import {writeFileSync} from 'fs';
import { stringify } from 'csv-stringify';

export function writeToFile(fileName: string, users: any[]) {
    stringify(users, { header: true, columns: ['firstName', 'lastName', 'email', 'schoolId', 'password'] }, (err, output) => {
        if (err) throw err;
        writeFileSync(fileName, output);
    });;
}
