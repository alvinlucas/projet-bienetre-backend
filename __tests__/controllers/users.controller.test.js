const request = require('supertest');
const app = require('../../app');

jest.mock('../../services/firebase', () => {
    const setMock = jest.fn(() => Promise.resolve());
    const getMock = jest.fn(() => ({ exists: false }));
    const whereMock = jest.fn(() => ({
        get: () => Promise.resolve({ empty: true }),
    }));

    return {
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                get: getMock,
                set: setMock,
            })),
            where: whereMock,
        })),
    };
});

describe('Contrôleur Utilisateur - createUser', () => {
    it("crée un utilisateur avec des données valides", async () => {
        const res = await request(app).post('/api/users/inscription').send({
            nom: "Lucas",
            prenom: "Alvin",
            email: "test@example.com",
            password: "P@ssw0rd!",
            pseudo: "alvin",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Utilisateur créé avec succès !");
    });

    it("refuse l'inscription si des champs sont manquants", async () => {
        const res = await request(app).post('/api/users/inscription').send({
            nom: "Lucas",
            email: "test@example.com",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Tous les champs sont requis/i);
    });

    it("refuse une adresse email invalide", async () => {
        const res = await request(app).post('/api/users/inscription').send({
            nom: "Lucas",
            prenom: "Alvin",
            email: "not-an-email",
            password: "P@ssw0rd!",
            pseudo: "alvin",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/e-mail invalide/i);
    });

    it("refuse un mot de passe faible", async () => {
        const res = await request(app).post('/api/users/inscription').send({
            nom: "Lucas",
            prenom: "Alvin",
            email: "test@example.com",
            password: "123456",
            pseudo: "alvin",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Le mot de passe doit contenir/i);
    });
});
