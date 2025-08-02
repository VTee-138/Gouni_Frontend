import { Pagination, PaginationItem, styled } from "@mui/material";

const CustomPaginationItem = styled(PaginationItem)({
  "&.Mui-selected": {
    backgroundColor: "#cd1628",
    color: "white",
    fontWeight: "bold",
  },
});
const PaginationCustom = ({
  totalPage,
  currentPage,
  handleChangePage,
  handleNextPage,
  handlePrevPage,
}) => {
  const onChangePage = (event, value) => {
    handleChangePage(value);
  };

  const handlePrevClick = () => {
    handlePrevPage();
  };

  const handleNextClick = () => {
    handleNextPage();
  };

  return (
    <Pagination
      count={totalPage}
      page={currentPage} // thêm dòng này
      color="primary"
      onChange={onChangePage}
      siblingCount={1}
      renderItem={(item) => (
        <CustomPaginationItem
          {...item}
          onClick={(event) => {
            if (item.type === "previous") {
              handlePrevClick();
            } else if (item.type === "next") {
              handleNextClick();
            }
            item.onClick?.(event);
          }}
        />
      )}
    />
  );
};

export default PaginationCustom;
