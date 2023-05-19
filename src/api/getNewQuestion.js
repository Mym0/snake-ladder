import axiosInstance from './config';

const getNewQuestionApi = async (numberOfNeededQuestions) => {
  const url = 'next-relevant-questions';
  const params = {
    numberOfNeededQuestions: numberOfNeededQuestions,
    // filterQueryFormat:filterQueryFormat,
  };

  try {
    const response = await axiosInstance().get(url, {
      params: params,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export default getNewQuestionApi;
