import { get, post } from "../common/apiClient";

const PATH_TEST = "/exam-result";
const postTest = async (id, body) => {
  return await post(PATH_TEST + `/submit-test/${id}`, body);
};
const getResultById = async (id) => {
  return await get(PATH_TEST + `/${id}`);
};
const getResultAll = async (id) => {
  return await get(PATH_TEST + `?examId=${id}`);
};

const checkCorrectAnswers = async (id) => {
  return await get(PATH_TEST + `/check-correct-answers/${id}`);
};

const getExamHistory = async (id) => {
  return await get(PATH_TEST + `/history/${id}`);
};

export { postTest, getResultById, getResultAll, checkCorrectAnswers, getExamHistory };
