"use client";

import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { ReactNode } from "react";

export type ListProps = {
  id: string;
  onDragEnd: OnDragEndResponder;
  draggable: boolean;
  children: ReactNode;
};

const List = ({ id, onDragEnd, draggable, children }: ListProps) => {
  if (draggable) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className="bg-gray-200"
            >
              {children}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <div style={getListStyle(false)} className="bg-gray-200">
      {children}
    </div>
  );
};

export default List;

// HELPERS

export const reorder: <T>(
  list: T[],
  startIndex: number,
  endIndex: number
) => T[] = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: "100%",
});
