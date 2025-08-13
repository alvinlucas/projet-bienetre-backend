const { isAdmin } = require("../../middlewares/auth");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("Middleware isAdmin", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        next = jest.fn();
    });

    it("refuse l'accès sans header Authorization", async () => {
        await isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: "Accès non autorisé : token manquant." });
        expect(next).not.toHaveBeenCalled();
    });

    it("refuse l'accès avec un token mal formé", async () => {
        req.headers.authorization = "TokenInvalide";

        await isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: "Accès non autorisé : token manquant." });
        expect(next).not.toHaveBeenCalled();
    });

    it("refuse l'accès si l'utilisateur n'est pas admin", async () => {
        req.headers.authorization = "Bearer fakeToken";
        jwt.verify.mockReturnValue({ isAdmin: false });

        await isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: "Accès refusé : vous n'êtes pas administrateur." });
        expect(next).not.toHaveBeenCalled();
    });

    it("autorise l'accès si l'utilisateur est admin", async () => {
        req.headers.authorization = "Bearer validToken";
        jwt.verify.mockReturnValue({ isAdmin: true, email: "admin@test.com" });

        await isAdmin(req, res, next);

        expect(req.user).toEqual({ isAdmin: true, email: "admin@test.com" });
        expect(next).toHaveBeenCalled();
    });

    it("refuse l'accès si le token est invalide", async () => {
        req.headers.authorization = "Bearer invalidToken";
        jwt.verify.mockImplementation(() => {
            throw new Error("Token invalide");
        });

        await isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            message: "Token invalide ou expiré.",
            error: expect.any(Error),
        });
        expect(next).not.toHaveBeenCalled();
    });
});
