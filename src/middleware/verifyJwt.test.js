const httpMocks = require("node-mocks-http");
const { verifySsoToken } = require("../dal/sign-in");
const verifyJwt = require("./verifyJwt");

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("../dal/sign-in");

describe("Verify JWT middleware", () => {
  let fakeRequest;
  let fakeResponse;
  let fakeNext;

  const fakeParsedJwt = {
    sub: "someUserId",
  };

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();
    fakeNext = jest.fn();

    fakeResponse.redirect = jest.fn().mockReturnValue(fakeResponse);
  });

  describe("when a valid SSO token cookie exists", () => {
    const fakeSsoToken = "someFakeSsoToken";

    beforeEach(() => {
      fakeRequest.cookies = {
        "turret-sso": fakeSsoToken,
      };

      verifySsoToken.mockResolvedValue(fakeParsedJwt);
    });

    it("assigns the parsed token to locals", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.locals.parsedJwt).toBe(fakeParsedJwt);
    });

    it("calls next", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(fakeNext).toHaveBeenCalled();
    });
  });

  describe("when an invalid SSO token cookie exists", () => {
    const fakeSsoToken = "someFakeSsoToken";

    beforeEach(() => {
      fakeRequest.cookies = {
        "turret-sso": fakeSsoToken,
      };

      verifySsoToken.mockRejectedValue(new Error("Some error"));
    });

    it("does not assign the parsed token to locals", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.locals.parsedJwt).toBeUndefined();
    });

    it("redirects to the sign-in page", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.redirect).toHaveBeenCalledWith("/sign-in");
    });

    it("logs an error", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(console.error).toHaveBeenCalledWith(
        "Unable to parse turret-sso JWT token"
      );
    });
  });

  describe("when no SSO token cookie exists", () => {
    beforeEach(() => {
      fakeRequest.cookies = {};
    });

    it("does not assign the parsed token to locals", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.locals.parsedJwt).toBeUndefined();
    });

    it("redirects to the sign-in page", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.redirect).toHaveBeenCalledWith("/sign-in");
    });

    it("logs an error", async () => {
      await verifyJwt(fakeRequest, fakeResponse, fakeNext);

      expect(console.log).toHaveBeenCalledWith(
        "Missing turret-sso JWT token cookie"
      );
    });
  });
});
