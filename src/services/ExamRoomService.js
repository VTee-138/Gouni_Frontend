import { get } from "../common/apiClient";

const PATH_EXAM_ROOM = "/exam-room";
const getExamRooms = async (
  pageNumber = 1,
  limit = 6,
  query,
  sort,
  order,
  isQuery
) => {
  if (query === "ALL" || query === "") {
    return await get(
      PATH_EXAM_ROOM +
        `?page=${pageNumber}&limit=${limit}&sort=${sort}&order=${order}&isQuery=${isQuery}`
    );
  }
  return await get(
    PATH_EXAM_ROOM +
      `?page=${pageNumber}&limit=${limit}&query=${query}&sort=${sort}&order=${order}&isQuery=${isQuery}`
  );
};
const getExamRoomById = async (id) => {
  return await get(PATH_EXAM_ROOM + `/${id}`);
};
const getSearchExamRoom = async () => {
  return await get(PATH_EXAM_ROOM + "/document-idtitle");
};

const getExamRoomCategory = async (pageNumber, subject = "", limit = 9) => {
  return await get(
    PATH_EXAM_ROOM +
      `/categories?page=${pageNumber}&limit=${limit}&subject=${subject}`
  );
};
export {
  getExamRooms,
  getExamRoomById,
  getSearchExamRoom,
  getExamRoomCategory,
};
