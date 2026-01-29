import { useEffect, useRef } from "react";

const ExamNumber = ({
  totalQuestions = 50,
  onSelect,
  hasStarted,
  answers = {},
  currentQuestion,
  questionList = [],
  resultMode = false,
  resultMap = {}
}) => {
  const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const containerRef = useRef(null);
  
  const getButtonClass = (index) => {
    const questionKey = questionList?.[index]?.question;

    if (resultMode) {
        const isCorrect = resultMap?.[questionKey];
        const isCurrent = questionKey === currentQuestion;
        
        // Base classes
        let classes = "border shadow-sm font-bold ";
        
        if (isCurrent) {
            classes += "ring-2 ring-blue-400 ring-offset-1 ";
        }

        if (isCorrect === true) {
             return classes + "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
        } else if (isCorrect === false) {
             return classes + "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
        } else {
             // Not answered or data missing
             return classes + "bg-gray-50 text-gray-400 border-gray-200";
        }
    }

    // Existing Logic...
    const isCurrent = questionKey === currentQuestion;
    const isAnswered = answers?.[questionKey];

    if (isCurrent) {
        return "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200";
    }
    if (isAnswered) {
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    }
    return "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50";
  };

  useEffect(() => {
    if (!containerRef.current || !questionList?.length) return;

    const index = questionList?.findIndex(
      (q) => q?.question === currentQuestion
    );
    if (index === -1) return;

    const rowIndex = Math.floor(index / 5); // Assuming 5 cols
    const buttonHeight = 40;
    const gap = 8;
    const scrollTop = rowIndex * (buttonHeight + gap);

    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }, [currentQuestion, questionList]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-4 text-xs text-gray-500 px-1">
          <div className="flex items-center gap-1">
               <span className="w-3 h-3 rounded-full bg-blue-600"></span> Đang làm
          </div>
          <div className="flex items-center gap-1">
               <span className="w-3 h-3 rounded-full bg-blue-50 border border-blue-200"></span> Đã làm
          </div>
           <div className="flex items-center gap-1">
               <span className="w-3 h-3 rounded-full bg-white border border-gray-200"></span> Chưa làm
          </div>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto custom-scrollbar p-1 pb-4"
      >
        {questions.length > 0 &&
          questions.map((num, index) => {
            return (
              <button
                key={num}
                onClick={() => onSelect?.(index)}
                disabled={!hasStarted}
                className={`
                    h-9 w-full rounded-lg text-sm font-semibold border transition-all duration-200 flex items-center justify-center
                    ${getButtonClass(index)}
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {num}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default ExamNumber;
