const db = require("../../services/firebase");

describe("Service firebase", () => {
    it("initialise firestore avec la méthode collection", () => {
        expect(db).toBeDefined();
        expect(typeof db.collection).toBe("function");
    });
});
