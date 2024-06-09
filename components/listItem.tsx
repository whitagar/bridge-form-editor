"use client";

import { Draggable, DraggableStyle } from "@hello-pangea/dnd";
import { ReactNode } from "react";
import { DragIndicator } from "@mui/icons-material";

export type ListItemProps = {
  id: string;
  index: number;
  draggable: boolean;
  children: ReactNode;
};

const ListItem = ({ id, index, children, draggable }: ListItemProps) => {
  if (draggable) {
    return (
      <Draggable key={id} draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            className="cursor-grab"
          >
            <div className="flex w-full items-start justify-start gap-2 text-[28px]">
              <DragIndicator
                color="primary"
                className="cursor-grab mt-[6px] grow-0"
                fontSize="inherit"
              />
              <div className="grow">{children}</div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }

  return <div style={getItemStyle(false)}>{children}</div>;
};

export default ListItem;

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggableStyle
) => ({
  // some basic styles to make the items look a bit nicer
  padding: 8 * 2,
  margin: `0 0 8px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});
