const request = require('supertest');
const app = require('../../app');
const db = require('../../services/firebase');

jest.mock('../../services/firebase');

describe('Contrôleur Vidéo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getActiveVideos', () => {
        it('retourne uniquement les vidéos non expirées et déjà publiées', async () => {
            const now = new Date();

            db.collection.mockReturnValue({
                get: jest.fn().mockResolvedValue({
                    forEach: (callback) => {
                        callback({
                            data: () => ({
                                titre: 'Vidéo 1',
                                datePublication: new Date(now.getTime() - 86400000).toISOString().split('T')[0],
                                dateExpiration: new Date(now.getTime() + 86400000).toISOString().split('T')[0],
                            })
                        });
                        callback({
                            data: () => ({
                                titre: 'Vidéo expirée',
                                datePublication: new Date(now.getTime() - 86400000).toISOString().split('T')[0],
                                dateExpiration: new Date(now.getTime() - 1000).toISOString().split('T')[0],
                            })
                        });
                    }
                })
            });

            const res = await request(app).get('/api/videos/active');
            expect(res.statusCode).toBe(200);
            expect(res.body.videos).toHaveLength(1);
            expect(res.body.videos[0].titre).toBe('Vidéo 1');
        });
    });

    describe('getVideo', () => {
        it("retourne 404 si la vidéo n'existe pas", async () => {
            db.collection.mockReturnValue({
                doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) })
            });

            const res = await request(app).get('/api/videos/123');
            expect(res.statusCode).toBe(404);
        });

        it('retourne les données de la vidéo si elle existe', async () => {
            db.collection.mockReturnValue({
                doc: () => ({
                    get: jest.fn().mockResolvedValue({
                        exists: true,
                        data: () => ({ titre: 'Ma vidéo' })
                    })
                })
            });

            const res = await request(app).get('/api/videos/123');
            expect(res.statusCode).toBe(200);
            expect(res.body.video.titre).toBe('Ma vidéo');
        });
    });
});
