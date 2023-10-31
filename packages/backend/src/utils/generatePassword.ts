import * as crypto from 'crypto'; 

export function generatePassword(length: number = 3): string {
    return crypto.randomBytes(length).toString('hex');
}
