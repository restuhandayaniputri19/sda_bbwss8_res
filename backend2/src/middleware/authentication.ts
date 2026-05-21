import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { db } from '../db';
import { users } from '../db/schema'; // Pastikan Bapak sudah buat schema users
import { eq } from 'drizzle-orm';

export const authentication = async (c: Context, next: Next) => {
        const authHeader = c.req.header('Authorization');
        console.log('--- Cek Token di Middleware Authentication ---');
        console.log('Auth Header:', authHeader);
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';

        if (authHeader && authHeader.startsWith('Bearer ')) {
            let token = authHeader.split(' ')[1]?.trim();
            console.log('Extracted Token:', token); // Debug log untuk memastikan token berhasil diekstrak

            if (token && token !== 'null' && token !== 'undefined') {        // 1. Verifikasi Token menggunakan fungsi bawaan Hono

                if (token.startsWith('token(') && token.endsWith(')')) {
                    token = token.substring(6, token.length - 1);
                }

                token = token.replace(/^token\(/, '').replace(/\)$/, '').replace(/['"]+/g, '');

                try {
                    // 1. Verifikasi Token
                    const decoded = await verify(token, secretKey, 'HS256');
                    console.log('Decoded JWT Payload Success:', decoded);

                    // 2. Cari User di Database
                    const [user] = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, Number(decoded.id)))
                        .limit(1);

                    if (user) {
                        c.set('user', user);
                        await next();
                    } else {
                        return c.json({ status: false, message: 'User not found' }, 401);
                    }
                } catch (verifyError: any) {
                    // Jika verify gagal (expired/mismatch), dia akan lari ke sini
                    console.error('JWT Verify Failed:', verifyError.message);
                    return c.json({ status: false, message: 'Token Expired or Invalid' }, 401);
                }
            } else {
                return c.json({ status: false, message: 'Invalid token' }, 401);
            }
        } else {
            return c.json({
                status: false,
                message: 'Authorization header missing or incorrect'
            }, 401);
        }
};