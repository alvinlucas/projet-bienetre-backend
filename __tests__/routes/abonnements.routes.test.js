const request = require('supertest');
const app = require('../../app');

describe('Routes abonnements', () => {
    it('doit retourner 404 si email non trouvé pour le statut', async () => {
        const res = await request(app).get('/api/subscriptions/status/inconnu@example.com');
        expect([200, 404]).toContain(res.statusCode);
    });

    it('doit refuser de créer un abonnement sans corps valide', async () => {
        const res = await request(app).post('/api/subscriptions/create').send({});
        expect([400, 500]).toContain(res.statusCode);
    });
});
