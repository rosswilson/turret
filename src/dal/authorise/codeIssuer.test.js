const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const AuthCode = require("../models/authCode");
const codeIssuer = require("./codeIssuer");

jest.spyOn(console, "debug").mockImplementation(() => { });
jest.spyOn(console, "error").mockImplementation(() => { });

jest.mock("crypto");
jest.mock("uuid");
jest.mock("../models/authCode");

describe("Authorisation Code Issuer", () => {
  let validPayload;

  const fakeAuthCodeString = "someRandomString";
  const fakeUuid = "someFakeUuid";
  const fakeUserId = "someFakeUserId";

  beforeEach(() => {
    crypto.randomBytes.mockImplementation((length, callback) => {
      return callback(null, fakeAuthCodeString);
    });

    uuidv4.mockReturnValue(fakeUuid);

    AuthCode.create.mockResolvedValue(undefined);

    validPayload = {
      clientId: "someClientId",
      redirectUri: "https://www.example.com/callback",
      scope: "scope1 scope2 scope3",
      userId: fakeUserId,
    };
  });

  describe("successful issuing", () => {
    it("returns a random authorisation code", async () => {
      const result = await codeIssuer(validPayload);

      expect(result).toBe(fakeAuthCodeString);
    });

    it("generates a random string of 24 bytes", async () => {
      await codeIssuer(validPayload);

      expect(crypto.randomBytes).toHaveBeenCalledWith(24, expect.any(Function));
    });

    it("stores the auth code in the database", async () => {
      await codeIssuer(validPayload);

      expect(AuthCode.create).toHaveBeenCalledWith({
        id: fakeUuid,
        authCode: fakeAuthCodeString,
        clientId: "someClientId",
        redirectUri: "https://www.example.com/callback",
        scope: "scope1 scope2 scope3",
        userId: fakeUserId,
      });
    });

    it("logs a debug message", async () => {
      await codeIssuer(validPayload);

      expect(console.debug).toHaveBeenCalledWith(
        "Recording authorisation code in database",
        {
          id: fakeUuid,
          authCode: fakeAuthCodeString,
          clientId: "someClientId",
          redirectUri: "https://www.example.com/callback",
          scope: "scope1 scope2 scope3",
          userId: fakeUserId,
        }
      );
    });
  });

  describe("error issuing an auth code", () => {
    const thrownError = new Error("Some fake error");

    beforeEach(() => {
      AuthCode.create.mockImplementation(() => {
        throw thrownError;
      });
    });

    it("throws an error", async () => {
      expect.assertions(1);

      try {
        await codeIssuer(validPayload);
      } catch (error) {
        expect(error).toBe(thrownError);
      }
    });

    it("logs the error", async () => {
      expect.assertions(1);

      try {
        await codeIssuer(validPayload);
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith(
          "Error when issuing authorisation code",
          thrownError
        );
      }
    });
  });
});
