import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
     SortableContext,
     verticalListSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem from "./sortable_item";
// Drag and drop 
// https://codesandbox.io/s/react-beautiful-dnd-board-base-0dv9b
// Author: Michael Miller
const containerStyle = {
     background: "#dadada",
     minWidth: '300px',
     padding: 10,
     margin: 10,
     flex: 1
};

export default function Container(props) {
     const { id, items, heading } = props;

     const { setNodeRef } = useDroppable({
          id
     });
     return (
          <SortableContext
               id={id}
               items={items}
               strategy={verticalListSortingStrategy}
          >
               <div ref={setNodeRef} style={containerStyle}>
                    <div style={{ fontWeight: 'bold', marginBottom: 10 }}>{heading}</div>
                    {items.map((id) => (
                         <SortableItem key={id} id={id} />
                    ))}
               </div>
          </SortableContext>
     );
}
