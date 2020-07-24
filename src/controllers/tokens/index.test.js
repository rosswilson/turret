const httpMocks = require("node-mocks-http");
const authoriseController = require(".");
const codeIssuer = require("../../dal/authorise/codeIssuer");

jest.mock("../../dal/authorise/codeIssuer");

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Authorise Controller", () => {
  let fakeRequest;
  let fakeResponse;

  const fakeUserId = "someFakeUserId";

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();

    fakeResponse.locals = {
      parsedJwt: {
        sub: fakeUserId,
      },
    };
  });

  describe("create", () => {
    const fakeClientId = "someClientId";
    const fakeScope = "scope1 scope2 scope3";
    const fakeRedirectUri = "https://www.example.com/callback";
    const fakeState = "someOpaqueState";
    const fakeCode = "someFakeCode";

    beforeEach(() => {
      const validPayload = {
        client_id: fakeClientId,
        response_type: "code",
        scope: fakeScope,
        redirect_uri: fakeRedirectUri,
        state: fakeState,
      };

      fakeRequest.query = validPayload;

      fakeResponse.redirect = jest.fn();

      codeIssuer.mockReturnValue(fakeCode);
    });

    it("calls the codeIssuer module with the expected arguments", async () => {
      await authoriseController.create(fakeRequest, fakeResponse);

      expect(codeIssuer).toHaveBeenCalledWith({
        clientId: fakeClientId,
        redirectUri: fakeRedirectUri,
        scope: fakeScope,
        userId: fakeUserId,
      });
    });

    it("redirects to the redirect_uri with code and state params", async () => {
      await authoriseController.create(fakeRequest, fakeResponse);

      expect(fakeResponse.redirect).toHaveBeenCalledWith(
        `${fakeRedirectUri}?code=${fakeCode}&state=${fakeState}`
      );
    });
  });
});
