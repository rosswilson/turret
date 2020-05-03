const validatePayload = require("./validate");

describe("Validate Sign In", () => {
  const validPayload = {
    email: "ross@example.com",
    password: "SomeSuperSecurePassword1!",
  };

  it("returns success when a valid payload is validated", () => {
    const result = validatePayload(validPayload);

    expect(result.error).toBeUndefined();
  });

  it("validates the email is present", () => {
    const result = validatePayload({
      ...validPayload,
      email: undefined,
    });

    const [firstError] = result.error.details;

    expect(firstError.message).toBe('"email" is required');
  });

  it("validates the email is a valid email address", () => {
    const result = validatePayload({
      ...validPayload,
      email: "ross",
    });

    const [firstError] = result.error.details;

    expect(firstError.message).toBe('"email" must be a valid email');
  });

  it("validates the password is present", () => {
    const result = validatePayload({
      ...validPayload,
      password: undefined,
    });

    const [firstError] = result.error.details;

    expect(firstError.message).toBe('"password" is required');
  });

  it("validates the password is long enough", () => {
    const result = validatePayload({
      ...validPayload,
      password: "123",
    });

    const [firstError] = result.error.details;

    expect(firstError.message).toBe(
      '"password" length must be at least 8 characters long'
    );
  });
});
