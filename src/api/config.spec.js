import axios from 'axios';
import axoisInstance from './config';

jest.mock('axios'); // Mock the axios module

describe('axoisInstance', () => {
  it('should create an instance of axios with the correct base URL and headers', () => {
    const mockUserToken = {
      accessToken: {
        accessToken: 'mockAccessToken',
      },
    };
    const expectedHeaders = {
      Authorization: 'Bearer mockAccessToken',
      apiKey: process.env.REACT_APP_API_KEY,
      apiSecret: process.env.REACT_APP_API_SECRET,
    };

    // Mock the localStorage.getItem method to return a valid user token
    jest.spyOn(JSON, 'parse').mockReturnValue(mockUserToken);

    axoisInstance();

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://app.octolearn.de/api/third-party/',
      headers: expectedHeaders,
    });
  });
});
