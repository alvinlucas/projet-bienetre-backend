jest.mock("nodemailer");

const nodemailer = require("nodemailer");
const { sendEmail } = require("../../services/emailService");

describe("Service emailService", () => {
    const mockSendMail = jest.fn();

    beforeEach(() => {
        // Remplace le transporteur par un mock avec sendMail
        nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
        mockSendMail.mockClear();
    });

    it("envoie un email avec les bons paramètres", async () => {
        mockSendMail.mockResolvedValue({ response: "Email envoyé" });

        await sendEmail("test@example.com", "Sujet test", "<p>Message</p>");

        expect(mockSendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: "test@example.com",
            subject: "Sujet test",
            html: "<p>Message</p>",
        });
    });

    it("lance une erreur si l'envoi échoue", async () => {
        mockSendMail.mockRejectedValue(new Error("Erreur SMTP"));

        await expect(sendEmail("fail@test.com", "Erreur", "<p>Erreur</p>"))
            .rejects.toThrow("Erreur SMTP");
    });
});
