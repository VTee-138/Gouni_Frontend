import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import MathRenderer from "../../../common/MathRenderer";

export default function TestTN({
  answers,
  currentQuestion,
  handleSelectAnswer,
  current,
  disable,
}) {
  const handleChange = (e) => {
    handleSelectAnswer(e.target.value, "TN");
  };

  return (
    <RadioGroup
      value={answers?.[currentQuestion] || ""}
      onChange={handleChange}
    >
      {["A", "B", "C", "D"].map((option) => (
        <FormControlLabel
          key={option}
          value={option}
          disabled={disable}
          control={<Radio />}
          label={<MathRenderer content={current?.[`contentAnswer${option}`]} />}
        />
      ))}
    </RadioGroup>
  );
}
