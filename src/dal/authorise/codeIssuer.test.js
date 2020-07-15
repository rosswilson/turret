const DynamoDB = require("aws-sdk/clients/dynamodb");
const crypto = require("crypto");
const codeIssuer = require("./codeIssuer");

jest.spyOn(console, "debug").mockImplementation(() => {});

jest.mock("aws-sdk/clients/dynamodb");
jest.mock("crypto");

describe("Authorisation Code Issuer", () => {
  let fakePutPromise;
  let fakePut;

  let validPayload;

  const fakeRandomString = "someRandomString";

  beforeEach(() => {
    fakePutPromise = jest.fn().mockResolvedValue();

    fakePut = jest.fn().mockReturnValue({
      promise: fakePutPromise,
    });

    DynamoDB.DocumentClient.mockReturnValue({
      put: fakePut,
    });

    crypto.randomBytes.mockImplementation((length, callback) => {
      return callback(null, fakeRandomString);
    });

    validPayload = {
      clientId: "someClientId",
      redirectUri: "https://www.example.com/callback",
      scope: "scope1 scope2 scope3",
    };
  });

  describe("successful issuing", () => {
    it("returns a random authorisation code", async () => {
      const result = await codeIssuer(validPayload);

      expect(result).toBe(fakeRandomString);
    });

    it("generates a random string with 48 characters", async () => {
      await codeIssuer(validPayload);

      expect(crypto.randomBytes).toHaveBeenCalledWith(48, expect.any(Function));
    });

    it("stores the auth code in the database", async () => {
      await codeIssuer(validPayload);

      expect(fakePut).toHaveBeenCalledWith({
        Item: {
          AuthCode: fakeRandomString,
          ClientId: "someClientId",
          RedirectUri: "https://www.example.com/callback",
          Scope: "scope1 scope2 scope3",
        },
        TableName: "AuthCodes",
      });
    });
  });
});
