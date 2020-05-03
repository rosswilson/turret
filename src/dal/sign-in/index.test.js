const fs = require("fs");
const jwt = require("jsonwebtoken");
const { generateSsoToken } = require(".");

jest.mock("fs", () => {
  return {
    promises: {
      readFile: jest.fn(),
    },
  };
});

jest.mock("jsonwebtoken");

describe("Sign In User", () => {
  let fakeKey = "someFakeKey";

  beforeEach(() => {
    fs.promises.readFile.mockResolvedValue(fakeKey);
  });

  describe("generateSsoToken", () => {
    it("calls the signing function with the expected arguments", async () => {
      const userId = "123";

      await generateSsoToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith({}, fakeKey, {
        algorithm: "ES256",
        audience: "turret-sso",
        expiresIn: "2y",
        issuer: "turret-sso",
        subject: userId,
      });
    });
  });
});
