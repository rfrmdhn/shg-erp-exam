// Ensure tests use the in-memory SQLite path and a deterministic JWT secret.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
