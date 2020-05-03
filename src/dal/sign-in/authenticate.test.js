const DynamoDB = require("aws-sdk/clients/dynamodb");
const bcrypt = require("bcrypt");
const authenticate = require("./authenticate");

jest.mock("bcrypt");

jest.mock("aws-sdk/clients/dynamodb");

describe("Authentication", () => {
  let fakeGetPromise;

  const payload = {
    email: "ross@example.com",
    password: "SomeSuperSecurePassword1!",
  };

  beforeEach(() => {
    fakeGetPromise = jest.fn().mockResolvedValue({
      Item: {
        Identifier: "ross@example.com",
        ID: "905abe3d-69ce-492b-8d30-c400ae2bcee4",
        Name: "Ross Wilson",
        PasswordHash: "somePasswordHash",
      },
    });

    DynamoDB.DocumentClient.mockReturnValue({
      get: jest.fn().mockReturnValue({
        promise: fakeGetPromise,
      }),
    });
  });

  describe("when the credentials are valid", () => {
    beforeEach(() => {
      bcrypt.compare.mockResolvedValue(true);
    });

    it("performs a password hash comparison", async () => {
      await authenticate(payload);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "SomeSuperSecurePassword1!",
        "somePasswordHash"
      );
    });

    it("returns a success response", async () => {
      const result = await authenticate(payload);

      expect(result).toEqual({
        success: true,
        userId: "905abe3d-69ce-492b-8d30-c400ae2bcee4",
      });
    });
  });

  describe("when the user is found but credentials are invalid", () => {
    beforeEach(() => {
      bcrypt.compare.mockResolvedValue(false);
    });

    it("performs a password hash comparison", async () => {
      await authenticate(payload);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "SomeSuperSecurePassword1!",
        "somePasswordHash"
      );
    });

    it("returns a failure response", async () => {
      const result = await authenticate(payload);

      expect(result).toEqual({
        success: false,
      });
    });
  });

  describe("when the user cannot be found in the database", () => {
    beforeEach(() => {
      fakeGetPromise = jest.fn().mockResolvedValue({
        Item: {},
      });

      DynamoDB.DocumentClient.mockReturnValue({
        get: jest.fn().mockReturnValue({
          promise: fakeGetPromise,
        }),
      });
    });

    it("returns a failure response", async () => {
      const result = await authenticate(payload);

      expect(result).toEqual({
        success: false,
      });
    });

    it("performs a dummy password check to prevent timing attacks", async () => {
      await authenticate(payload);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "SomeSuperSecurePassword1!",
        "dummyPasswordToPreventTimingAttacks"
      );
    });
  });
});
