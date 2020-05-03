const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const persist = require("./persist");

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "debug").mockImplementation(() => {});

jest.mock("aws-sdk/clients/dynamodb");
jest.mock("uuid");
jest.mock("bcrypt");

describe("Persist User", () => {
  let fakePut;
  let fakePutPromise;

  const validPayload = {
    name: "Ross Wilson",
    email: "ross@example.com",
    password: "SomeSuperSecurePassword1!",
    repeatPassword: "SomeSuperSecurePassword1!",
  };

  beforeEach(() => {
    fakePutPromise = jest.fn().mockResolvedValue();

    fakePut = jest.fn().mockReturnValue({
      promise: fakePutPromise,
    });

    DynamoDB.DocumentClient.mockReturnValue({
      put: fakePut,
    });

    uuidv4.mockReturnValue("3dea1723-871a-4274-a783-b4977f2d9511");

    bcrypt.hash.mockResolvedValue("fakePasswordHash");
  });

  describe("successful saving", () => {
    it("hashes the users password with eight rounds", async () => {
      await persist(validPayload);

      expect(bcrypt.hash).toHaveBeenCalledWith("SomeSuperSecurePassword1!", 8);
    });

    it("generates a v4 UUID", async () => {
      await persist(validPayload);

      expect(uuidv4).toHaveBeenCalled();
    });

    it("stores the user in the database", async () => {
      await persist(validPayload);

      expect(fakePut).toHaveBeenCalledWith({
        Item: {
          ID: "3dea1723-871a-4274-a783-b4977f2d9511",
          Identifier: "ross@example.com",
          Name: "Ross Wilson",
          PasswordHash: "fakePasswordHash",
        },
        TableName: "Users",
      });
    });

    it("downcases the user email before saving", async () => {
      await persist({
        ...validPayload,
        email: "ROSS@EXAMPLE.COM",
      });

      expect(fakePut).toHaveBeenCalledWith({
        Item: {
          ID: "3dea1723-871a-4274-a783-b4977f2d9511",
          Identifier: "ross@example.com",
          Name: "Ross Wilson",
          PasswordHash: "fakePasswordHash",
        },
        TableName: "Users",
      });
    });

    it("returns the user ID on success", async () => {
      const result = await persist(validPayload);

      expect(result.userId).toEqual("3dea1723-871a-4274-a783-b4977f2d9511");
    });

    it("logs some debug information", async () => {
      await persist(validPayload);

      expect(console.debug).toHaveBeenCalledWith("Recording user in database", {
        Item: {
          ID: "3dea1723-871a-4274-a783-b4977f2d9511",
          Identifier: "ross@example.com",
          Name: "Ross Wilson",
          PasswordHash: "fakePasswordHash",
        },
        TableName: "Users",
      });
    });
  });

  describe("if the database write fails", () => {
    const fakeError = new Error("Some DynamoDB problem");

    beforeEach(() => {
      fakePutPromise.mockImplementation(() => {
        throw fakeError;
      });
    });

    it("throws", async () => {
      expect.assertions(1);

      try {
        await persist(validPayload);
      } catch (error) {
        expect(error).toBe(fakeError);
      }
    });

    it("logs the error", async () => {
      expect.assertions(1);

      try {
        await persist(validPayload);
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith(
          "Error when persisting user into database",
          fakeError
        );
      }
    });
  });
});
