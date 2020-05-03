const httpMocks = require("node-mocks-http");
const signInController = require(".");
const authenticate = require("../../dal/sign-in/authenticate");
const { generateSsoToken } = require("../../dal/sign-in");

jest.mock("../../dal/sign-in/authenticate");
jest.mock("../../dal/sign-in");

describe("Sign In Controller", () => {
  let fakeRequest;
  let fakeResponse;

  let fakeJwt = "someFakeJwt";

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();
  });

  describe("index", () => {
    it("renders the expected template", () => {
      fakeResponse.render = jest.fn();

      signInController.index(fakeRequest, fakeResponse);

      expect(fakeResponse.render).toHaveBeenCalledWith("sign-in/index", {
        title: "Sign In | Turret",
      });
    });
  });

  describe("create", () => {
    describe("when the credentials are valid", () => {
      beforeEach(() => {
        const payload = {
          email: "ross@example.com",
          password: "SomeSuperSecurePassword1!",
        };

        fakeRequest.body = payload;

        authenticate.mockResolvedValue({
          success: true,
          userId: "905abe3d-69ce-492b-8d30-c400ae2bcee4",
        });

        generateSsoToken.mockResolvedValue(fakeJwt);
      });

      it("redirects", async () => {
        fakeResponse.redirect = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.redirect).toHaveBeenCalledWith("/");
      });

      it("sets a sso token cookie", async () => {
        fakeResponse.cookie = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.cookie).toHaveBeenCalledWith(
          "turret-sso",
          "someFakeJwt",
          { httpOnly: true, maxAge: 63072000000, sameSite: "lax", secure: true }
        );
      });
    });

    describe("when the credentials are invalid", () => {
      beforeEach(() => {
        const payload = {
          email: "ross@example.com",
          password: "wrongPassword",
        };

        fakeRequest.body = payload;

        authenticate.mockResolvedValue({
          success: false,
        });
      });

      it("re-renders", async () => {
        fakeResponse.render = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.render).toHaveBeenCalledWith("sign-in/index", {
          title: "Sign In | Turret",
          error: "Either the email address or password were incorrect.",
        });
      });

      it("sets the status code to 401", async () => {
        fakeResponse.render = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(401);
      });

      it("does not set a sso token cookie", async () => {
        fakeResponse.cookie = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.cookie).not.toHaveBeenCalled();
      });
    });

    describe("when the payload fails validation checks", () => {
      beforeEach(() => {
        const invalidPayload = {
          email: "",
          password: "short",
        };

        fakeRequest.body = invalidPayload;
      });

      it("re-renders", async () => {
        fakeResponse.render = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.render).toHaveBeenCalledWith("sign-in/index", {
          title: "Sign In | Turret",
          error: "Those details don't look right, please try again.",
        });
      });

      it("sets the status code to 400", async () => {
        fakeResponse.render = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(400);
      });

      it("does not set a sso token cookie", async () => {
        fakeResponse.cookie = jest.fn();

        await signInController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.cookie).not.toHaveBeenCalled();
      });
    });
  });
});
