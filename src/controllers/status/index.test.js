const httpMocks = require("node-mocks-http");
const statusController = require(".");

describe("Status Controller", () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = httpMocks.createRequest();
    fakeResponse = httpMocks.createResponse();
  });

  describe("index", () => {
    it("sends an ok response", () => {
      fakeResponse.send = jest.fn();

      statusController.index(fakeRequest, fakeResponse);

      expect(fakeResponse.send).toHaveBeenCalledWith("OK");
    });
  });
});
