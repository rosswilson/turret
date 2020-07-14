const httpMocks = require("node-mocks-http");
const authoriseController = require(".");

describe("Authorise Controller", () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();
  });

  describe("index", () => {
    it("sends ok", () => {
      fakeResponse.send = jest.fn();

      authoriseController.index(fakeRequest, fakeResponse);

      expect(fakeResponse.send).toHaveBeenCalledWith("ok");
    });
  });
});
