import { TextField } from "@mui/material";
import MathRenderer from "../../../common/MathRenderer";

export default function TestTLN_M({
  answers,
  question,
  handleChangeUserAnswersTLN_M,
  q,
  disable,
}) {
  const currentAnswers = answers[question] || {};

  return (
    <div id={question}>
      {q?.contentY1 && (
        <div className="mt-4 mb-4">
          <div className="flex" style={{ fontSize: "18px" }}>
            <strong>1.</strong>&nbsp; &nbsp;
            <MathRenderer content={q?.contentY1} />
          </div>

          <div className="mt-5">
            <TextField
              label="Đáp án *"
              type="text"
              color="success"
              focused
              name={question + "-1."}
              onChange={handleChangeUserAnswersTLN_M}
              className="text-center"
              value={currentAnswers["1."] || ""}
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
      )}
      {q?.contentY2 && (
        <div className="mb-4">
          <div className="flex">
            <strong>2.</strong>&nbsp; &nbsp;
            <MathRenderer content={q?.contentY2} />
          </div>

          <div className="mt-5">
            <TextField
              label="Đáp án *"
              type="text"
              color="success"
              focused
              name={question + "-2."}
              onChange={handleChangeUserAnswersTLN_M}
              className="text-center"
              value={currentAnswers["2."] || ""}
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
      )}
      {q?.contentY3 && (
        <div className="mb-4">
          <div className="flex">
            <strong>3.</strong>&nbsp; &nbsp;
            <MathRenderer content={q?.contentY3} />
          </div>

          <div className="mt-5">
            <TextField
              label="Đáp án *"
              type="text"
              color="success"
              focused
              name={question + "-3."}
              onChange={handleChangeUserAnswersTLN_M}
              className="text-center"
              value={currentAnswers["3."] || ""}
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
      )}
      {q?.contentY4 && (
        <div className="">
          <div className="flex">
            <strong>4.</strong>&nbsp; &nbsp;
            <MathRenderer content={q?.contentY4} />
          </div>
          <div className="mt-5">
            <TextField
              label="Đáp án *"
              type="text"
              color="success"
              focused
              name={question + "-4."}
              onChange={handleChangeUserAnswersTLN_M}
              className="text-center"
              value={currentAnswers["4."] || ""}
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
      )}
    </div>
  );
}
