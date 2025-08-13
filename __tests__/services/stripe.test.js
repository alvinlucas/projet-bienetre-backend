const stripe = require("../../services/stripe");

describe("Service stripe", () => {
    it("initialise l'instance stripe", () => {
        expect(stripe).toBeDefined();
        expect(typeof stripe.customers).toBe("object");
        expect(typeof stripe.subscriptions).toBe("object");
    });
});
