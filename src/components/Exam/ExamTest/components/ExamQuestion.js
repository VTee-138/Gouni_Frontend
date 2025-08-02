import React from "react";
import MathRenderer from "../../../../common/MathRenderer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ExamQuestion = ({
  questions,
  questionsMQ,
  current,
  currentMQ,
  answers,
  markedQuestions,
  toggleMarkQuestion,
  handleSelect,
  onDragEnd,
  isQuestionAnswered,
}) => {
  // Render các lựa chọn đáp án dựa trên loại câu hỏi
  const renderAnswerOptions = (question) => {
    if (!question) {
      console.error("Invalid question object in renderAnswerOptions");
      return null;
    }

    switch (question.type) {
      case "TN":
        // Sử dụng mảng options để hiển thị các đáp án
        const options = ["A", "B", "C", "D"];
        const selectedOption = answers[question.question];

        return (
          <div className="space-y-3">
            {options.map((option) => {
              const isSelected = selectedOption === option;

              return (
                <div
                  key={option}
                  className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? "bg-blue-50 border-blue-400 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    // Cập nhật trực tiếp state
                    handleSelect(option, "", question);
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="leading-relaxed text-gray-800">
                      <MathRenderer
                        content={question[`contentAnswer${option}`]}
                      />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "DS":
        return (
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-[100px_1fr_100px_100px] gap-2 bg-gray-100 rounded-t-lg p-3 font-medium text-gray-700">
              <div>Mệnh đề</div>
              <div>Nội dung</div>
              <div className="text-center">Đúng</div>
              <div className="text-center">Sai</div>
            </div>

            {/* Table Body */}
            <div className="border border-gray-200 divide-y rounded-b-lg">
              {/* Row a */}
              {question.contentYA && (
                <div className="grid grid-cols-[100px_1fr_100px_100px] gap-2 items-center">
                  <div className="p-4 text-gray-600">a)</div>
                  <div className="py-4 pr-4">
                    <MathRenderer content={question.contentYA} />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ a: "D" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.a === "D"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.a === "D" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ a: "S" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.a === "S"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.a === "S" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Row b */}
              {question.contentYB && (
                <div className="grid grid-cols-[100px_1fr_100px_100px] gap-2 items-center">
                  <div className="p-4 text-gray-600">b)</div>
                  <div className="py-4 pr-4">
                    <MathRenderer content={question.contentYB} />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ b: "D" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.b === "D"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.b === "D" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ b: "S" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.b === "S"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.b === "S" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Row c */}
              {question.contentYC && (
                <div className="grid grid-cols-[100px_1fr_100px_100px] gap-2 items-center">
                  <div className="p-4 text-gray-600">c)</div>
                  <div className="py-4 pr-4">
                    <MathRenderer content={question.contentYC} />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ c: "D" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.c === "D"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.c === "D" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ c: "S" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.c === "S"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.c === "S" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Row d */}
              {question.contentYD && (
                <div className="grid grid-cols-[100px_1fr_100px_100px] gap-2 items-center">
                  <div className="p-4 text-gray-600">d)</div>
                  <div className="py-4 pr-4">
                    <MathRenderer content={question.contentYD} />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ d: "D" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.d === "D"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.d === "D" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSelect({ d: "S" }, "", question)}
                      className={`w-8 h-8 rounded-[50%] border-2 flex items-center justify-center transition-all ${
                        answers[question?.question]?.d === "S"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {answers[question?.question]?.d === "S" && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "MA":
        return (
          <div className="space-y-4">
            {/* Options */}
            {["contentC1", "contentC2", "contentC3", "contentC4"].map(
              (contentKey, index) => {
                const optionKey = `c${index + 1}`;
                if (!question[contentKey]) return null;

                return (
                  <label
                    key={optionKey}
                    className="flex items-start gap-3 p-4 transition-all duration-200 border rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(optionKey, "", question);
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-colors ${
                          answers[question?.question]?.includes(optionKey)
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[question?.question]?.includes(optionKey) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="leading-relaxed text-gray-800">
                        <MathRenderer content={question[contentKey]} />
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={answers[question?.question]?.includes(optionKey)}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(optionKey, "", question);
                      }}
                    />
                  </label>
                );
              }
            )}
          </div>
        );

      case "TLN":
        return (
          <div className="w-full">
            {/* Input Section - Ngắn gọn và đầu dòng */}
            <div className="mb-4">
              <div className="relative w-[17rem]">
                <input
                  type="text"
                  value={answers[question?.question] ?? ""}
                  onChange={(e) => handleSelect(e.target.value, "", question)}
                  placeholder="Nhập câu trả lời..."
                  className="w-full p-4 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-white border-2 border-gray-300 rounded-lg shadow-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hint Section */}
            {question.hint && (
              <div className="p-3 border-l-4 border-blue-400 rounded-r-lg bg-blue-50">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  <div className="text-sm text-blue-700">
                    <MathRenderer content={question.hint} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "TLN_M":
        const tlnmAnswers = answers[question?.question] || {};
        const subQuestions = Object.keys(tlnmAnswers)
          .map((k, index) => ({
            key: k,
            content: question[`contentY${index + 1}`],
          }))
          .filter((sub) => sub.content);
        return (
          <div className="w-full space-y-3">
            {subQuestions.map((sub, idx) => (
              <div key={sub.key} className="flex items-center gap-2">
                {/* Mệnh đề */}
                <div className="text-sm font-semibold text-gray-800 md:text-base">
                  {sub.key}
                </div>

                {/* Nội dung mệnh đề và Input inline */}
                <div className="flex flex-wrap items-center flex-1 gap-2">
                  <div className="text-sm text-gray-800 md:text-base">
                    <MathRenderer content={sub.content} />
                  </div>

                  {/* Input ngay sau nội dung mệnh đề */}
                  <div className="relative w-[17rem]">
                    <input
                      type="text"
                      value={tlnmAnswers[sub.key] ?? ""}
                      onChange={(e) =>
                        handleSelect(e.target.value, sub, question)
                      }
                      placeholder="Nhập câu trả lời..."
                      className="w-full p-4 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-white border-2 border-gray-300 rounded-lg shadow-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-400"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Hint Section */}
            {question.hint && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mt-4">
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">💡</span>
                  <div className="text-sm text-blue-700">
                    <MathRenderer content={question.hint} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "KT":
        const currentAnswers = answers[question?.question] || {};
        const subQuestions_KT = Object.keys(currentAnswers)
          .map((k, index) => ({
            slotKey: k,
            content: question[`contentY${index + 1}`],
          }))
          .filter((sub) => sub.content);

        // Get items that are not currently in any slot
        const availableItems = question.items.filter(
          (item) => !Object.values(currentAnswers).includes(item.id)
        );

        return (
          <DragDropContext onDragEnd={onDragEnd(question)}>
            <div className="w-full space-y-6">
              {/* Items to drag */}
              <Droppable droppableId="items" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
                  >
                    {availableItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`px-4 py-2 bg-white rounded-lg border-2 ${
                              snapshot.isDragging
                                ? "border-blue-500 shadow-lg"
                                : "border-gray-200 hover:border-blue-400"
                            } cursor-grab transition-all duration-200`}
                          >
                            <MathRenderer content={item.content} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Drop zones */}
              <div className="space-y-4">
                {subQuestions_KT.map((sub, index) => {
                  return (
                    <Droppable key={sub?.slotKey} droppableId={sub?.slotKey}>
                      {(provided, snapshot) => (
                        <div className="flex items-center gap-2">
                          {/* Số thứ tự mệnh đề */}
                          <div className="text-gray-800 text-sm md:text-base font-semibold">
                            {index + 1})
                          </div>

                          {/* Nội dung mệnh đề và Drop zone inline */}
                          <div className="flex-1 flex items-center gap-2 flex-wrap">
                            {/* Nội dung mệnh đề */}
                            {sub?.content && (
                              <div className="text-gray-800 text-sm md:text-base">
                                <MathRenderer content={sub?.content} />
                              </div>
                            )}

                            {/* Drop zone ngay sau nội dung mệnh đề */}
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`w-[17rem] p-4 border-2 rounded-lg flex items-center transition-colors ${
                                snapshot.isDraggingOver
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {currentAnswers[sub?.slotKey] ? (
                                <Draggable
                                  draggableId={currentAnswers[sub?.slotKey]}
                                  index={0}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`w-full ${
                                        snapshot.isDragging ? "opacity-50" : ""
                                      }`}
                                    >
                                      <MathRenderer
                                        content={
                                          question.items.find(
                                            (item) =>
                                              item.id ===
                                              currentAnswers[sub?.slotKey]
                                          )?.content || ""
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ) : (
                                <div className="text-gray-400 italic text-sm">
                                  Kéo thả vào đây
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>

              {/* Hint Section */}
              {question.hint && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mt-4">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <div className="text-sm text-blue-700">
                      <MathRenderer content={question.hint} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DragDropContext>
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  const renderMQQuestion = (question) => {
    return (
      <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
        {/* Left: Parent Question */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white border-r border-gray-300">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold mb-4">{question.title}</h2>
          </div>

          <p className="text-gray-700 mb-4">
            <MathRenderer content={question.contentQuestions} />
          </p>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Question"
              className="max-w-full h-auto mx-auto"
            />
          )}
        </div>

        {/* Right: Child Questions */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
          {question.range.map((num) => {
            const childQuestion = questions.find(
              (q) =>
                q.question === `Câu ${num}` || q.question === `Câu hỏi ${num}`
            );
            const childQuestionIndex = questions.findIndex(
              (q) =>
                q.question === `Câu ${num}` || q.question === `Câu hỏi ${num}`
            );
            return (
              <div
                key={num}
                className="mb-6 border-gray-200"
                id={`question-${childQuestionIndex}`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg font-bold">
                      {num}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                      <MathRenderer content={childQuestion?.contentQuestions} />
                    </p>
                    {childQuestion?.imageUrl && (
                      <img
                        src={childQuestion.imageUrl}
                        alt="Question"
                        className="mt-4 max-w-full h-auto mx-auto"
                      />
                    )}
                  </div>

                  {/* Icon đánh dấu câu hỏi con ở góc phải */}
                  <button
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                      markedQuestions.includes(childQuestionIndex)
                        ? "bg-[#f59e0b] text-white border-[#f59e0b] hover:bg-[#d97706]"
                        : "bg-white text-gray-500 border-gray-300 hover:border-[#f59e0b] hover:text-[#f59e0b]"
                    }`}
                    onClick={() => toggleMarkQuestion(childQuestionIndex)}
                    title={
                      markedQuestions.includes(childQuestionIndex)
                        ? "Bỏ đánh dấu"
                        : "Đánh dấu làm sau"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {childQuestion && renderAnswerOptions(childQuestion)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuestion = () => {
    const currentQuestion = questions[current];
    if (!currentQuestion) return null;

    // Lấy số thứ tự câu hỏi thực tế
    const currentQuestionNumber = parseInt(
      currentQuestion.question.match(/\d+/)?.[0] || "0"
    );

    // Kiểm tra xem câu hỏi hiện tại có thuộc MQ group nào không
    const currentQuestionMQ = questionsMQ.find((e) =>
      e?.range.includes(currentQuestionNumber)
    );

    console.log("renderQuestion:", {
      current,
      currentQuestionNumber,
      currentMQ,
      currentQuestionMQ: currentQuestionMQ?.question || null,
      isRegularQuestion: !currentQuestionMQ,
    });

    if (currentQuestionMQ) {
      return renderMQQuestion(currentQuestionMQ);
    }

    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg font-bold">
              {current + 1}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 text-sm md:text-base leading-relaxed">
              <MathRenderer content={currentQuestion?.contentQuestions} />
            </p>
            {currentQuestion?.imageUrl && (
              <img
                src={currentQuestion?.imageUrl}
                alt="Question"
                className="mt-4 max-w-full h-auto mx-auto"
              />
            )}
          </div>

          {/* Icon đánh dấu câu hỏi ở góc phải */}
          <button
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
              markedQuestions.includes(current)
                ? "bg-[#f59e0b] text-white border-[#f59e0b] hover:bg-[#d97706]"
                : "bg-white text-gray-500 border-gray-300 hover:border-[#f59e0b] hover:text-[#f59e0b]"
            }`}
            onClick={() => toggleMarkQuestion(current)}
            title={
              markedQuestions.includes(current)
                ? "Bỏ đánh dấu"
                : "Đánh dấu làm sau"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Answer Options based on question type */}
        <div className="space-y-3">{renderAnswerOptions(currentQuestion)}</div>
      </div>
    );
  };

  return renderQuestion();
};

export default ExamQuestion;
