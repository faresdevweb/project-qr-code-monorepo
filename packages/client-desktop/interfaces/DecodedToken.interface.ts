
export interface DecodedToken {
    sub: string,
    role: string,
    email: string,
    schoolId: string,
    schoolCustomId: string,
    iat: number,
    exp: number
};