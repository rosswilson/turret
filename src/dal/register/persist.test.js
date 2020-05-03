const persist = require("./persist");

jest.spyOn(console, "debug").mockImplementation(() => {});

jest.mock("aws-sdk/clients/dynamodb", () => {
  const DocumentClient = jest.fn().mockReturnValue({
    put: jest.fn().mockReturnValue({
      promise: jest.fn(),
    }),
  });

  return {
    DocumentClient,
  };
});

describe("Persist User", () => {
  const validPayload = {
    name: "Ross Wilson",
    email: "ross@example.com",
    password: "SomeSuperSecurePassword1!",
    repeatPassword: "SomeSuperSecurePassword1!",
  };

  it("returns the user ID on success", async () => {
    const result = await persist(validPayload);

    expect(result.userId).toMatch(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
    );
  });
});
