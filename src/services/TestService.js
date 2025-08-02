import { get, post } from "../common/apiClient";

const PATH_TEST = "/exam-result";
const postTest = async (id, body) => {
  return await post(PATH_TEST + `/submit-test/${id}`, body);
};
const getResultById = async (id, examRoomId) => {
  return await get(PATH_TEST + `/${id}/${examRoomId}`);
};
const getResultAll = async (id, examRoomId) => {
  return await get(PATH_TEST + `?examId=${id}&examRoomId=${examRoomId}`);
};
// /exam-result/check-correct-answers/:examId
const getResultHistory = async (id, examRoomId) => {
  return await get(PATH_TEST + `/check-correct-answers/${id}/${examRoomId}`);
};

export { postTest, getResultById, getResultAll, getResultHistory };
