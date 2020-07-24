const bcrypt = require("bcrypt");
const User = require("../models/user");
const authenticate = require("./authenticate");

jest.mock("../models/user");
jest.mock("bcrypt");

describe("Authentication", () => {
  const payload = {
    email: "ross@example.com",
    password: "SomeSuperSecurePassword1!",
  };

  beforeEach(() => {
    User.findOne.mockResolvedValue({
      id: "905abe3d-69ce-492b-8d30-c400ae2bcee4",
      email: "ross@example.com",
      name: "Ross Wilson",
      passwordHash: "somePasswordHash",
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
      User.findOne.mockResolvedValue(null);
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
