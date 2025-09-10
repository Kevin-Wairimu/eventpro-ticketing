import crypto from 'crypto';


export function randomTokenString(length = 32) {
return crypto.randomBytes(length).toString('hex');
}


export function hashToken(token) {
return crypto.createHash('sha256').update(token).digest('hex');
}