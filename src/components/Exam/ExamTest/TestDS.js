import MathRenderer from "../../../common/MathRenderer";

export default function TestDS({
  answers,
  currentQuestion,
  handleSelectAnswer,
  current,
  disable,
}) {
  const options = [
    { key: "contentYA", label: "a" },
    { key: "contentYB", label: "b" },
    { key: "contentYC", label: "c" },
    { key: "contentYD", label: "d" },
  ];

  const handleCheckboxChange = (optionKey, value) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion]: {
        ...answers[currentQuestion],
        [optionKey]:
          answers[currentQuestion]?.[optionKey] === value ? undefined : value,
      },
    };
    handleSelectAnswer(updatedAnswers, "DS");
  };

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-left border border-collapse border-gray-300">
        <thead>
          <tr className="text-white bg-[#ed8b87]">
            <th className="p-3 border border-gray-300 whitespace-nowrap">
              Mệnh đề
            </th>
            <th className="p-3 border border-gray-300">Nội dung</th>
            <th className="p-3 text-center border border-gray-300">Đúng</th>
            <th className="p-3 text-center border border-gray-300">Sai</th>
          </tr>
        </thead>
        <tbody>
          {options.map(({ key, label }) =>
            current?.[key] ? (
              <tr key={key} className="border border-gray-300">
                <td className="p-3 font-bold border border-gray-300">
                  {label})
                </td>
                <td
                  className="p-3 border border-gray-300"
                  style={{ fontSize: "18px" }}
                >
                  <MathRenderer content={current[key]} />
                </td>
                <td className="p-3 text-center border border-gray-300">
                  <label className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-6 h-6 cursor-pointer appearance-none border-2 border-[#ed8b87] rounded-md checked:bg-[#ed8b87] checked:border-[#ed8b87] checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center transition-all hover:scale-110"
                      checked={answers[currentQuestion]?.[label] === "D"}
                      onChange={() => handleCheckboxChange(label, "D")}
                      disabled={disable}
                    />
                  </label>
                </td>
                <td className="p-3 text-center border border-gray-300">
                  <label className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-6 h-6 cursor-pointer appearance-none border-2 border-gray-500 rounded-md checked:bg-gray-500 checked:border-gray-500 checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center transition-all hover:scale-110"
                      checked={answers[currentQuestion]?.[label] === "S"}
                      onChange={() => handleCheckboxChange(label, "S")}
                      disabled={disable}
                    />
                  </label>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}
