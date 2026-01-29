// generate-token.ts
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: 'c17ff44e-3a26-4b25-b659-136a380f16b0', role: 'VENDOR' },
  'auth-secret', // must match product-service .env
  { expiresIn: '1d' }
);

console.log(token);

