const httpMocks = require("node-mocks-http");
const rootController = require(".");

describe("Root Controller", () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();
  });

  describe("index", () => {
    it("renders the expected template", () => {
      fakeResponse.render = jest.fn();

      rootController.index(fakeRequest, fakeResponse);

      expect(fakeResponse.render).toHaveBeenCalledWith("root/index", {
        title: "Turret",
      });
    });
  });
});
