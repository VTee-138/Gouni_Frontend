import { input } from "@mui/material";
import MathRenderer from "../../../common/MathRenderer";

export default function TestMA({
  answers,
  question,
  handleChangeUserAnswersMA,
  q,
  disable,
}) {
  return (
    <div className="p-4 overflow-x-auto">
      <div>
        {q?.contentC1 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-6 h-6 cursor-pointer appearance-none border-2 border-[#ed8b87] rounded-md checked:bg-[#ed8b87] checked:border-[#ed8b87] checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center transition-all hover:scale-110 mr-2"
              onChange={(e) => handleChangeUserAnswersMA(e, "c1", question)}
              checked={answers[question]?.includes("c1")}
              // sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />{" "}
            <MathRenderer content={q?.contentC1} />
          </div>
        )}
        {q?.contentC2 && (
          <div className="flex items-center" style={{ fontSize: "18px" }}>
            <input
              type="checkbox"
              className="w-6 h-6 cursor-pointer appearance-none border-2 border-[#ed8b87] rounded-md checked:bg-[#ed8b87] checked:border-[#ed8b87] checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center transition-all hover:scale-110 mr-2"
              onChange={(e) => handleChangeUserAnswersMA(e, "c2", question)}
              checked={answers[question]?.includes("c2")}
              // sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />{" "}
            <MathRenderer content={q?.contentC2} />
          </div>
        )}
        {q?.contentC3 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-6 h-6 cursor-pointer appearance-none border-2 border-[#ed8b87] rounded-md checked:bg-[#ed8b87] checked:border-[#ed8b87] checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center transition-all hover:scale-110 mr-2"
              onChange={(e) => handleChangeUserAnswersMA(e, "c3", question)}
              checked={answers[question]?.includes("c3")}
              // sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />{" "}
            <MathRenderer content={q?.contentC3} />
          </div>
        )}
        {q?.contentC4 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-6 h-6 cursor-pointer appearance-none border-2 border-[#ed8b87] rounded-md checked:bg-[#ed8b87] checked:border-[#ed8b87] checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center transition-all hover:scale-110 mr-2"
              onChange={(e) => handleChangeUserAnswersMA(e, "c4", question)}
              checked={answers[question]?.includes("c4")}
              // sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />{" "}
            <MathRenderer content={q?.contentC4} />
          </div>
        )}
      </div>
    </div>
  );
}
