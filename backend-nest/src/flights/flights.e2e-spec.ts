import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('Flights (e2e)', () => {
  let app: INestApplication;
  let validToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    validToken = 'TOKEN';
  });

  afterAll(async () => await app.close());

  it('POST /api/flights without token should return 401', async () => {
    const server = app.getHttpServer() as Server;

    return request(server)
      .post('/api/flights')
      .send({
        flightNumber: 'AA123',
        origin: 'JFK',
        destination: 'LAX',
        departureTime: '2023-10-01T10:00:00Z',
        arrivalTime: '2023-10-01T14:00:00Z',
        status: 'scheduled',
      })
      .expect(401);
  });

  it('POST /api/flights with valid token should return 201', async () => {
    const server = app.getHttpServer() as Server;

    return request(server)
      .post('/api/flights')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        flightNumber: 'AA123',
        origin: 'JFK',
        destination: 'LAX',
        departureTime: '2023-10-01T10:00:00Z',
        arrivalTime: '2023-10-01T14:00:00Z',
        status: 'scheduled',
      })
      .expect(201);
  });

  it('POST /api/flights with invalid body should return 400', async () => {
    const server = app.getHttpServer() as Server;

    return request(server)
      .post('/api/flights')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        flightNumber: 'AA123',
        origin: 'JFK',
        destination: 'LAX',
        departureTime: '2023-10-01T10:00:00Z',
        arrivalTime: '2023-10-01T09:00:00Z',
        status: 'scheduled',
      })
      .expect(400);
  });
});
