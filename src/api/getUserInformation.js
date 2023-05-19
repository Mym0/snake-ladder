import axiosInstance from './config';

const getUserInformationApi = async () => {
  const url = 'account';

  try {
    const response = await axiosInstance().get(url);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export default getUserInformationApi;
