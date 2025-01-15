/* jest.mock('../src/database/db'); // Mock the database pool
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../src/database/db'; // Ajusta el path según tu estructura
import { app } from '../src/index'; // Ajusta el path según tu estructura
import request from 'supertest';


describe('POST /register', () => {
  it('should successfully register a new user', async () => {
    // Mock the pool query to return no existing user
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    // Mock bcrypt and jwt
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('fakeSalt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

    const response = await request(app)
      .post('/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User registered OK' });
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should return an error if the user already exists', async () => {
    // Mock the pool query to return an existing user
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ email: 'john.doe@example.com' }] });

    const response = await request(app)
      .post('/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'User already exists' });
  });

  it('should return validation errors if the input is invalid', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toHaveLength(3); // Expecting 3 validation errors
  });

  it('should handle internal server errors', async () => {
    // Simulate a database error
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const response = await request(app)
      .post('/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Something went wrong' });
  });
});
 */



jest.mock('../src/database/db', () => {
  return {
    __esModule: true,
    default: {
      query: jest.fn(), // Mockea directamente la función query
      connect: jest.fn().mockResolvedValue({
        release: jest.fn(), // Mock del método release si se usa
      }),
    },
  };
});// Mock del pool de base de datos
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../src/database/db'; // Ajusta el path según tu estructura
import { app } from '../src/index'; // Ajusta el path según tu estructura
import request from 'supertest';

describe('POST /api/users/register', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it('should successfully register a new user', async () => {
    // Mock del query para que no haya usuarios existentes
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    // Mock de bcrypt y jwt
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('fakeSalt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

    const response = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User registered OK' });
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should return an error if the user already exists', async () => {
    // Mock del query para que el usuario ya exista
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ email: 'john.doe@example.com' }] });

    const response = await request(app)
      .post('/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'User already exists' });
  });

  it('should return validation errors if the input is invalid', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toHaveLength(3); // Esperamos 3 errores de validación
  });

  it('should handle internal server errors', async () => {
    // Simulación de error en la base de datos
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const response = await request(app)
      .post('/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Something went wrong' });
  });
});
