import axios from 'axios';
const baseUrl = 'https://app.octolearn.de/api/third-party/';
const apiKey = process.env.REACT_APP_API_KEY;
const apiSecret = process.env.REACT_APP_API_SECRET;

const axoisInstance = () => {
  const userToken = JSON.parse(localStorage.getItem('okta-token-storage'));
  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${userToken.accessToken?.accessToken}`,
      apiKey,
      apiSecret,
    },
  });
};

export default axoisInstance;
