import { get } from "../common/apiClient";

const PATH_EXAM = "/exam";
const getExam = async (page = 1, limit = 6, query = "", typeOfExam = "", status = "") => {
  return await get(
    PATH_EXAM +
      `?page=${page}&limit=${limit}&q=${query}&typeOfExam=${typeOfExam}&status=${status}`
  );
};
const getExamDetail = async (id) => {
  return await get(PATH_EXAM + `/${id}`);
};
const getExamTrend = async () => {
  return await get(PATH_EXAM + `/top-trending`);
};
const getPost = async (pageNumber, type = "", limit = 9) => {
  return await get(
    PATH_EXAM + `/categories?page=${pageNumber}&limit=${limit}&type=${type}`
  );
};

const getSearch = async () => {
  return await get(PATH_EXAM + "/exam-idtitle");
};

const getExamByExamRoomId = async (
  pageNumber,
  type = "",
  limit = 6,
  id,
  search,
  typeOfExam
) => {
  return await get(
    PATH_EXAM +
      `/examroomid/${id}?page=${pageNumber}&limit=${limit}&type=${type}&query=${search}&typeOfExam=${typeOfExam}`
  );
};
export {
  getExam,
  getExamTrend,
  getPost,
  getSearch,
  getExamDetail,
  getExamByExamRoomId,
};
