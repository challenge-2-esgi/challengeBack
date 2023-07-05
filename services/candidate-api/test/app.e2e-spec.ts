import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationStatus, PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuidV4 } from 'uuid';

describe('ApplicationsController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const application = {
    userId: uuidV4(),
    offerId: uuidV4(),
    motivation: 'I have relevant experience and skills for this position.',
  };

  function createApplication() {
    return request(app.getHttpServer())
      .post('/applications')
      .field('motivation', application.motivation)
      .field('userId', application.userId)
      .field('offerId', application.offerId);
  }

  function acceptApplication(id: string) {
    return request(app.getHttpServer())
      .patch('/applications/' + id)
      .send({ status: ApplicationStatus.ACCEPTED });
  }

  function refuseApplication(id: string) {
    return request(app.getHttpServer())
      .patch('/applications/' + id)
      .send({ status: ApplicationStatus.REFUSED });
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.$transaction([prisma.application.deleteMany()]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /applications', () => {
    return createApplication()
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            ...application,
            cv: expect.any(String),
            status: ApplicationStatus.PENDING,
          }),
        );
      });
  });

  it('GET /applications', () => {
    return request(app.getHttpServer())
      .get('/applications')
      .expect(200)
      .expect([]);
  });

  it('GET /applications/:id', async () => {
    const postResponse = await createApplication().expect(201);

    return request(app.getHttpServer())
      .get(`/applications/${postResponse.body.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: postResponse.body.id,
            ...application,
            cv: expect.any(String),
            status: ApplicationStatus.PENDING,
          }),
        );
      });
  });

  it('PATCH /applications/:id', async () => {
    const postResponse = await createApplication().expect(201);

    await acceptApplication(postResponse.body.id)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: postResponse.body.id,
            ...application,
            cv: expect.any(String),
            status: ApplicationStatus.ACCEPTED,
          }),
        );
      });

    return refuseApplication(postResponse.body.id)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: postResponse.body.id,
            ...application,
            cv: expect.any(String),
            status: ApplicationStatus.REFUSED,
          }),
        );
      });
  });
});

describe('BookmarksController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const bookmark = {
    userId: uuidV4(),
    offerId: uuidV4(),
  };

  function createBookmark() {
    return request(app.getHttpServer()).post('/bookmarks').send(bookmark);
  }

  function removeBookmark(id: string) {
    return request(app.getHttpServer()).delete('/bookmarks/' + id);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.$transaction([prisma.bookmark.deleteMany()]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /bookmarks', () => {
    return createBookmark()
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            ...bookmark,
          }),
        );
      });
  });

  it('GET /bookmarks', () => {
    return request(app.getHttpServer())
      .get('/bookmarks')
      .expect(200)
      .expect([]);
  });

  it('DELETE /bookmarks/:id', async () => {
    const postResponse = await createBookmark().expect(201);

    return removeBookmark(postResponse.body.id)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: postResponse.body.id,
            ...bookmark,
          }),
        );
      });
  });
});
