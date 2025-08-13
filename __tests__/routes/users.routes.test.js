const request = require('supertest');
const app = require('../../app');

describe('Routes utilisateurs', () => {
    it('refuse une inscription sans données', async () => {
        const res = await request(app).post('/api/users/inscription').send({});
        expect([400, 500]).toContain(res.statusCode);
    });

    it('refuse une connexion sans données', async () => {
        const res = await request(app).post('/api/users/connexion').send({});
        expect([400, 401, 500]).toContain(res.statusCode);
    });
});
