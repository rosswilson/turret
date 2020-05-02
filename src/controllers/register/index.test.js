const httpMocks = require("node-mocks-http");
const registerController = require(".");

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Register Controller", () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();
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

  describe.only("create", () => {
    it("redirects when the payload is valid", () => {
      const validPayload = {
        name: "Ross Wilson",
        email: "ross@example.com",
        password: "SomeSuperSecurePassword1!",
        repeatPassword: "SomeSuperSecurePassword1!",
      };

      fakeRequest.body = validPayload;

      fakeResponse.redirect = jest.fn();

      registerController.create(fakeRequest, fakeResponse);

      expect(fakeResponse.redirect).toHaveBeenCalledWith("/");
    });

    it("re-renders when the payload is invalid", () => {
      const validPayload = {
        name: "Ross Wilson",
        email: "",
        password: "SomeSuperSecurePassword1!",
        repeatPassword: "NotTheRepeatedPassword",
      };

      fakeRequest.body = validPayload;

      fakeResponse.render = jest.fn();

      registerController.create(fakeRequest, fakeResponse);

      expect(fakeResponse.render).toHaveBeenCalledWith("register/index", {
        title: "Register | Turret",
        name: "Ross Wilson",
        email: "",
        error: "Oops, please complete all the fields",
      });
    });
  });
});
