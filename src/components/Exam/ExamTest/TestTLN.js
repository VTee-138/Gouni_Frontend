import { TextField } from "@mui/material";

export default function TestTLN({
  answers,
  question,
  handleChangeUserAnswersTLN,
  disable,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-5 text-black">
      <div className="mt-5">
        <TextField
          label="Đáp án *"
          type="text"
          color="success"
          focused
          name={question}
          onChange={handleChangeUserAnswersTLN}
          className="text-center"
          value={answers[question] || ""}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={disable}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ed8b87", // Đổi màu viền
              },
              "&:hover fieldset": {
                borderColor: "#ed8b87", // Đổi màu viền khi hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ed8b87", // Đổi màu viền khi input được focus
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ed8b87", // Đổi màu label
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#ed8b87", // Đổi màu label khi focus
            },
          }}
        />
      </div>
    </div>
  );
}
