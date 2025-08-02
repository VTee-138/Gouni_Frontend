import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import MathRenderer from "../../../common/MathRenderer";

export default function TestKT({ onDragEnd, q, key, answers, disable }) {
  if (!q) return null;

  const { question, contentQuestions, imageUrl } = q;

  return (
    <div key={key} id={question}>
      {/* Drag & Drop */}
      <DragDropContext onDragEnd={onDragEnd} disable={disable}>
        <div className="container p-6 mx-auto">
          <div key={q.question} className="mb-8">
            {/* Khu vực item gốc (nguồn) */}
            <Droppable droppableId={q.question}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-2 rounded mt-2 min-h-[50px] w-fit border-2 border-dashed border-[#ed8b87]"
                >
                  <div className="flex flex-wrap lg:space-x-2">
                    {q?.items?.map((item, index) => (
                      <Draggable
                        key={item?.id}
                        draggableId={item?.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-auto p-2 mt-2 mr-2 text-center text-white bg-[#ed8b87] rounded lg:mt-0"
                          >
                            <MathRenderer content={item?.content} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Các slot trả lời */}
            <div className="mt-4">
              {["1", "2", "3", "4"].map((num) => {
                const contentKey = `contentY${num}`;
                const slotKey = `slot${num}`;
                const slotContent = q?.[contentKey];

                if (!slotContent) return null;

                return (
                  <div
                    key={slotKey}
                    className="flex items-center mb-4 space-x-4"
                  >
                    <div className="flex" style={{ fontSize: "18px" }}>
                      <strong>{num}) </strong>&nbsp;&nbsp;
                      <MathRenderer content={slotContent} />
                    </div>

                    <Droppable droppableId={slotKey}>
                      {(provided, snapshot) => {
                        const isDraggingOver = snapshot.isDraggingOver;
                        const hasValue = q?.answers?.[slotKey]; // Kiểm tra xem slot có giá trị không

                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-2 rounded min-h-[50px] lg:w-auto w-auto border-2 ${
                              isDraggingOver || hasValue
                                ? "border-[#ed8b87]"
                                : "border-dashed border-[#ccc]"
                            }`}
                            style={{
                              display: "inline-block",
                              width: "auto",
                              minWidth: hasValue ? "none" : "100px",
                            }}
                          >
                            {q?.answers?.[slotKey] && (
                              <div className="w-auto p-2 text-center text-white bg-[#ed8b87] rounded">
                                <MathRenderer
                                  content={q?.answers?.[slotKey]?.content}
                                />
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
