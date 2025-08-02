import { get } from "../common/apiClient";

const PATH_EXAM = "/exam";
const getExam = async () => {
  return await get(PATH_EXAM);
};
const getExamDetail = async (id, examRoomId) => {
  return await get(PATH_EXAM + `/${id}?examRoomId=${examRoomId}`);
};
const getExamTrend = async (page, type, limit, examRoomId) => {
  return await get(PATH_EXAM + `/top-trending/${examRoomId}`);
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
