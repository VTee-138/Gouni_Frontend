// import { get } from "../common/apiClient";

// const PATH_COURSE = "/course";
// const getCourses = async (
//   pageNumber = 1,
//   limit = 6,
//   query,
//   sort,
//   order,
//   isQuery,
//   id
// ) => {
//   if (query === "ALL" || query === "") {
//     return await get(
//       PATH_COURSE +
//         `?page=${pageNumber}&limit=${limit}&sort=${sort}&order=${order}&isQuery=${isQuery}&id=${id}`
//     );
//   }
//   return await get(
//     PATH_COURSE +
//       `?page=${pageNumber}&limit=${limit}&query=${query}&sort=${sort}&order=${order}&isQuery=${isQuery}&id=${id}`
//   );
// };
// const getCourseById = async (id) => {
//   return await get(PATH_COURSE + `/${id}`);
// };
// const getSearchCourse = async () => {
//   return await get(PATH_COURSE + "/document-idtitle");
// };

// const getCourseCategory = async (pageNumber, subject = "", limit = 9) => {
//   return await get(
//     PATH_COURSE +
//       `/categories?page=${pageNumber}&limit=${limit}&subject=${subject}`
//   );
// };
// const checkUserBuyCourse = async (examId, examRoomId) => {
//   return await get(
//     PATH_COURSE + `/check-user-buy-course/${examId}/${examRoomId}`
//   );
// };
// export {
//   getCourses,
//   getCourseById,
//   getSearchCourse,
//   getCourseCategory,
//   checkUserBuyCourse,
// };
