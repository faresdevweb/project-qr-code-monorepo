import { parse } from 'csv-parse';

export async function parseCSV(csv: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(csv, { columns: true }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  