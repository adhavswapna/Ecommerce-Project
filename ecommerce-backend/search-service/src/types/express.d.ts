declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'USER' | 'VENDOR' | 'ADMIN';
      };
    }
  }
}

export {};
