const httpMocks = require("node-mocks-http");
const registerController = require(".");
const persist = require("../../dal/register/persist");
const { generateSsoToken } = require("../../dal/sign-in");

jest.mock("../../dal/register/persist");
jest.mock("../../dal/sign-in");

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Register Controller", () => {
  let fakeRequest;
  let fakeResponse;

  let fakeUserId = "10cb8eaa-ed39-4251-978a-16c94d0a05d5";
  let fakeJwt = "someFakeJwt";

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();

    persist.mockResolvedValue({ userId: fakeUserId });
    generateSsoToken.mockResolvedValue(fakeJwt);
  });

  describe("index", () => {
    it("renders the expected template", () => {
      fakeResponse.render = jest.fn();

      registerController.index(fakeRequest, fakeResponse);

      expect(fakeResponse.render).toHaveBeenCalledWith("register/index", {
        title: "Register | Turret",
      });
    });
  });

  describe("create", () => {
    describe("when the payload is valid", () => {
      beforeEach(() => {
        const validPayload = {
          name: "Ross Wilson",
          email: "ross@example.com",
          password: "SomeSuperSecurePassword1!",
          repeatPassword: "SomeSuperSecurePassword1!",
        };

        fakeRequest.body = validPayload;
      });

      it("redirects", async () => {
        fakeResponse.redirect = jest.fn();

        await registerController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.redirect).toHaveBeenCalledWith("/");
      });

      it("sets a sso token cookie when the payload is valid", async () => {
        fakeResponse.cookie = jest.fn();

        await registerController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.cookie).toHaveBeenCalledWith(
          "turret-sso",
          "someFakeJwt",
          { httpOnly: true, maxAge: 63072000000, sameSite: "lax", secure: true }
        );
      });
    });

    describe("when the payload is invalid", () => {
      beforeEach(() => {
        const invalidPayload = {
          name: "Ross Wilson",
          email: "",
          password: "SomeSuperSecurePassword1!",
          repeatPassword: "NotTheRepeatedPassword",
        };

        fakeRequest.body = invalidPayload;
      });

      it("re-renders", async () => {
        fakeResponse.render = jest.fn();

        await registerController.create(fakeRequest, fakeResponse);

        expect(fakeResponse.render).toHaveBeenCalledWith("register/index", {
          title: "Register | Turret",
          name: "Ross Wilson",
          email: "",
          error: "Oops, please complete all the fields",
        });
      });
    });
  });
});
