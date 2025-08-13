const request = require('supertest');
const app = require('../../app');

describe('Routes vidéos', () => {
    it('retourne les vidéos actives', async () => {
        const res = await request(app).get('/api/videos/active');
        expect([200, 204]).toContain(res.statusCode);
        expect(typeof res.body).toBe('object');
    });

    it('refuse d’ajouter une vidéo sans être admin', async () => {
        const res = await request(app).post('/api/videos/add').send({});
        expect([401, 403]).toContain(res.statusCode);
    });
});
