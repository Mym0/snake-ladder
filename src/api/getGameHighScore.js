import axiosInstance from './config';

const getGameHighScoreApi = async () => {
  const url = 'record';

  try {
    const response = await axiosInstance().get(url);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export default getGameHighScoreApi;
