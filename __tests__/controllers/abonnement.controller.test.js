const request = require('supertest');
const app = require('../../app');
const db = require('../../services/firebase');
const stripe = require('../../services/stripe');

jest.mock('../../services/firebase');
jest.mock('../../services/stripe');

describe('Contrôleur Abonnement', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkSubscriptionStatus', () => {
        it("retourne 404 si aucun abonnement n'est trouvé", async () => {
            db.collection.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    get: jest.fn().mockResolvedValue({ empty: true }),
                }),
            });

            const res = await request(app).get('/api/subscriptions/status/test@example.com');
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/aucun abonnement/i);
        });

        it("retourne 200 et les données si l'abonnement est trouvé", async () => {
            const mockData = {
                type: "Trimestriel",
                dateDebut: new Date().toISOString(),
                dateFin: new Date(Date.now() + 86400000).toISOString(),
                status: "Actif",
            };

            db.collection.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    get: jest.fn().mockResolvedValue({
                        empty: false,
                        docs: [{
                            data: () => ({ ...mockData }),
                            ref: { update: jest.fn() }
                        }]
                    }),
                }),
            });

            const res = await request(app).get('/api/subscriptions/status/test@example.com');
            expect(res.statusCode).toBe(200);
            expect(res.body.type).toBe("Trimestriel");
            expect(res.body.status).toBe("Actif");
        });
    });

    describe('createSubscription', () => {
        it("retourne 400 si email ou paymentMethodId manquent", async () => {
            const res = await request(app).post('/api/subscriptions/create').send({});
            expect(res.statusCode).toBe(400);
        });

        it("retourne 200 si la création est réussie", async () => {
            const mockCustomer = { id: 'cus_test' };
            const mockSubscription = {
                id: 'sub_test',
                current_period_end: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90
            };

            stripe.customers.create.mockResolvedValue(mockCustomer);
            stripe.subscriptions.create.mockResolvedValue(mockSubscription);

            const mockUserRef = {
                update: jest.fn().mockResolvedValue()
            };
            const mockAbonnementRef = {
                set: jest.fn().mockResolvedValue()
            };

            db.collection.mockImplementation((col) => {
                if (col === 'abonnements') {
                    return { doc: () => mockAbonnementRef };
                }
                if (col === 'utilisateurs') {
                    return { doc: () => mockUserRef };
                }
                return {};
            });

            const res = await request(app).post('/api/subscriptions/create').send({
                email: "test@example.com",
                paymentMethodId: "pm_test"
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.subscription).toBeDefined();
        });
    });

    describe('cancelSubscription', () => {
        it("retourne 400 si email est manquant", async () => {
            const res = await request(app).post('/api/subscriptions/cancel').send({});
            expect(res.statusCode).toBe(400);
        });

        it("retourne 404 si utilisateur non trouvé", async () => {
            db.collection.mockImplementation((col) => ({
                doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) })
            }));

            const res = await request(app).post('/api/subscriptions/cancel').send({ email: 'test@example.com' });
            expect(res.statusCode).toBe(404);
        });

        it("retourne 404 si aucun abonnement n'est trouvé", async () => {
            db.collection.mockImplementation((col) => {
                if (col === 'utilisateurs') {
                    return { doc: () => ({ get: jest.fn().mockResolvedValue({ exists: true }) }) };
                }
                return {
                    where: () => ({
                        get: jest.fn().mockResolvedValue({ empty: true }),
                    })
                };
            });

            const res = await request(app).post('/api/subscriptions/cancel').send({ email: 'test@example.com' });
            expect(res.statusCode).toBe(404);
        });

        it("retourne 200 si l'abonnement est déjà expiré", async () => {
            const expiredDate = new Date(Date.now() - 100000).toISOString();
            db.collection.mockImplementation((col) => {
                if (col === 'utilisateurs') {
                    return { doc: () => ({ get: jest.fn().mockResolvedValue({ exists: true }) }) };
                }
                return {
                    where: () => ({
                        get: jest.fn().mockResolvedValue({
                            empty: false,
                            docs: [{
                                data: () => ({ dateFin: expiredDate, status: "Actif" }),
                                ref: { update: jest.fn().mockResolvedValue() },
                            }]
                        }),
                    })
                };
            });

            const res = await request(app).post('/api/subscriptions/cancel').send({ email: 'test@example.com' });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/déjà expiré/i);
        });
    });
});
