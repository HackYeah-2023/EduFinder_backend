import {sign, verify} from 'jsonwebtoken';
import {config} from '../config';

interface JWT_payload {
    user_id: string;
}

// Sign jwt token
export async function signToken(payload: JWT_payload): Promise<string> {
    return sign(payload, config.JWT_SECRET, {
        expiresIn: '1d',
    });
}

// Verifhy jwt token
export async function verifyToken(token: string): Promise<JWT_payload> {
    return verify(token, config.JWT_SECRET) as JWT_payload;
}
