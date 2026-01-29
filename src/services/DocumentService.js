// import { get } from "../common/apiClient";

// const PATH_DOCUMENT = "/document";

// const getDocuments = async (
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
//       PATH_DOCUMENT +
//         `?page=${pageNumber}&limit=${limit}&sort=${sort}&order=${order}&isQuery=${isQuery}&id=${id}`
//     );
//   }
//   return await get(
//     PATH_DOCUMENT +
//       `?page=${pageNumber}&limit=${limit}&query=${query}&sort=${sort}&order=${order}&isQuery=${isQuery}&id=${id}`
//   );
// };
// const getDocumentById = async (id) => {
//   return await get(PATH_DOCUMENT + `/${id}`);
// };
// const getNumberDownloadDocument = async (id) => {
//   return await get(PATH_DOCUMENT + `/count-download/${id}`);
// };

// const getSearchDocument = async () => {
//   return await get(PATH_DOCUMENT + "/document-idtitle");
// };

// const getDocumentTrend = async () => {
//   return await get(PATH_DOCUMENT + "/top-trending");
// };
// const getDocumentCategory = async (pageNumber, subject = "", limit = 9) => {
//   return await get(
//     PATH_DOCUMENT +
//       `/categories?page=${pageNumber}&limit=${limit}&subject=${subject}`
//   );
// };
// export {
//   getDocuments,
//   getDocumentById,
//   getNumberDownloadDocument,
//   getSearchDocument,
//   getDocumentTrend,
//   getDocumentCategory,
// };
