import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CompaniesController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const address = {
    streetNumber: '12',
    street: 'Rue Réaumur',
    city: 'Paris',
    postcode: '750012',
    state: 'Ile-of-France',
    country: 'France',
  };
  const company = {
    name: 'company',
    siren: '532432457',
    website: 'https://company.com/',
    sector: 'Artificial Intelligence',
    size: 12,
    description: 'company presnetation',
    motivation: 'what we are looking for',
    ownerId: '3b00c20c-c9ee-402a-a61a-667a51c5231a',
    address: address,
  };

  const updateDto = {
    name: 'rekuten',
    size: 36,
    address: {
      streetNumber: '18',
    },
  };

  function createCompany() {
    return request(app.getHttpServer())
      .post('/companies')
      .field('name', company.name)
      .field('siren', company.siren)
      .field('website', company.website)
      .field('size', company.size.toString())
      .field('sector', company.sector)
      .field('description', company.description)
      .field('motivation', company.motivation)
      .field('ownerId', company.ownerId)
      .field('streetNumber', company.address.streetNumber)
      .field('street', company.address.street)
      .field('city', company.address.city)
      .field('postcode', company.address.postcode)
      .field('state', company.address.state)
      .field('country', company.address.country);
  }

  function updateCompany(id: string) {
    return request(app.getHttpServer())
      .patch(`/companies/${id}`)
      .field('name', updateDto.name)
      .field('size', updateDto.size)
      .field('streetNumber', updateDto.address.streetNumber);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.company.deleteMany(),
      prisma.address.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /companies', () => {
    return createCompany()
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            logo: null,
            ...company,
            address: {
              ...company.address,
              id: expect.any(String),
            },
          }),
        );
      });
  });

  test('GET /companies', () => {
    return request(app.getHttpServer())
      .get('/companies')
      .expect(200)
      .expect([]);
  });

  test('GET /companies/:id', async () => {
    const postResponse = await createCompany().expect(201);

    return request(app.getHttpServer())
      .get(`/companies/${postResponse.body.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: postResponse.body.id,
            logo: null,
            ...company,
            address: {
              ...company.address,
              id: expect.any(String),
            },
          }),
        );
      });
  });

  test('PATCH /companies/:id', async () => {
    const postResponse = await createCompany().expect(201);

    return updateCompany(postResponse.body.id)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: postResponse.body.id,
            logo: null,
            ...company,
            ...updateDto,
            address: {
              ...company.address,
              ...updateDto.address,
              id: postResponse.body.address.id,
            },
          }),
        );
      });
  });

  test('DELETE /company/:id', async () => {
    const postResponse = await createCompany().expect(201);

    return request(app.getHttpServer())
      .delete(`/companies/${postResponse.body.id}`)
      .expect(200);
  });
});
