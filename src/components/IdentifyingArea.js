import React, { useEffect, useState } from 'react';
import {
     DndContext,
     DragOverlay,
     closestCorners,
     KeyboardSensor,
     PointerSensor,
     useSensor,
     useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Container from "./DnD/container";
import { Item } from "./DnD/sortable_item";
import { ENDPOINTS, createAPIEndpoint } from '.';
import { Button } from '@mui/material';
const wrapperStyle = {
     display: "flex",
     flexDirection: "row"
};

const defaultAnnouncements = {
     onDragStart(id) {
          console.log(`Picked up draggable item ${id}.`);
     },
     onDragOver(id, overId) {
          if (overId) {
               console.log(
                    `Draggable item ${id} was moved over droppable area ${overId}.`
               );
               return;
          }

          console.log(`Draggable item ${id} is no longer over a droppable area.`);
     },
     onDragEnd(id, overId) {
          if (overId) {
               console.log(
                    `Draggable item ${id} was dropped over droppable area ${overId}`
               );
               return;
          }

          console.log(`Draggable item ${id} was dropped.`);
     },
     onDragCancel(id) {
          console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
     }
};

export default function IdentifyingArea() {
     const [questions, setQuestions] = useState([]);
     const [answers, setAnswers] = useState([]);
     const [count, setCount] = useState(0);
     const [items, setItems] = useState({
          root: [],
          container1: [],
          container2: [],
          container3: [],
          container4: []
     });
     const [activeId, setActiveId] = useState();
     const fetchData = async () => {
          try {
               const response = await createAPIEndpoint(ENDPOINTS.identifyingArea).getIdentifyingAreaData();
               const { PossibleAnswers, Questions } = response.data;

               // Set the questions
               setQuestions(Questions.slice(0, 4));

               // Set the answers
               setAnswers(PossibleAnswers);

               // Initialize the "root" container with the answers
               setItems((prevItems) => ({
                    ...prevItems,
                    root: PossibleAnswers.map((answer) => answer)
               }));
          } catch (error) {
               console.error('Error fetching data:', error);
          }
     };
     useEffect(() => {
          fetchData();
     }, []);

     const handleGetDataButtonClick = async () => {

          const dataDictionary = {};

          for (let i = 0; i < 4; i++) {
               const question = questions[i];
               const containerId = `container${i + 1}`;
               const itemInContainer = items[containerId][0];
               dataDictionary[question] = itemInContainer;
          }
          await createAPIEndpoint(ENDPOINTS.identifyingArea)
               .checkAnswers(dataDictionary)
               .then(
                    (response) => {
                         if (response.data === true) {
                              setCount(count + 1)
                         }
                         else {
                              setCount(0)
                         }
                         fetchData();
                         setItems((prevItems) => ({
                              root: [],
                              container1: [],
                              container2: [],
                              container3: [],
                              container4: []
                         }));
                    }
               );
     };

     const sensors = useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, {
               coordinateGetter: sortableKeyboardCoordinates
          })
     );

     return (
          <div>
               <div>
                    <h3>Streak: {count}</h3>
               </div>
               <div style={wrapperStyle}>
                    <DndContext
                         announcements={defaultAnnouncements}
                         sensors={sensors}
                         collisionDetection={closestCorners}
                         onDragStart={handleDragStart}
                         onDragOver={handleDragOver}
                         onDragEnd={handleDragEnd}
                    >
                         <Container id="root" items={items.root} heading="Answer" />
                         <Container id="container1" items={items.container1} heading={questions[0]} />
                         <Container id="container2" items={items.container2} heading={questions[1]} />
                         <Container id="container3" items={items.container3} heading={questions[2]} />
                         <Container id="container4" items={items.container4} heading={questions[3]} />
                         <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
                    </DndContext>
                    {/* Submit button */}
                    <Button
                         sx={{
                              m: 2,
                              position: 'fixed',
                              bottom: '20px',
                              right: '30px',
                              minWidth: '150px',
                              minHeight: '60px',
                         }}
                         variant="contained"
                         onClick={handleGetDataButtonClick}
                    >
                         Submit
                    </Button>
               </div>
          </div>

     );

     function findContainer(id) {
          if (id in items) {
               return id;
          }

          return Object.keys(items).find((key) => items[key].includes(id));
     }

     function handleDragStart(event) {
          const { active } = event;
          const { id } = active;

          setActiveId(id);
     }

     function handleDragOver(event) {
          const { active, over, draggingRect } = event;
          const { id } = active;
          const { id: overId } = over;

          // Find the containers
          const activeContainer = findContainer(id);
          const overContainer = findContainer(overId);

          if (
               !activeContainer ||
               !overContainer ||
               activeContainer === overContainer
          ) {
               return;
          }

          setItems((prev) => {
               const activeItems = prev[activeContainer];
               const overItems = prev[overContainer];

               // Find the indexes for the items
               const activeIndex = activeItems.indexOf(id);
               const overIndex = overItems.indexOf(overId);

               let newIndex;
               if (overId in prev) {
                    // We're at the root droppable of a container
                    newIndex = overItems.length + 1;
               } else {
                    const element = document.getElementById('myElement');
                    if (element !== null) {
                         const offsetTop = element.offsetTop;
                         // do something with offsetTop
                    }
                    const isBelowLastItem =
                         over &&
                         overIndex === overItems.length - 1 &&
                         draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

                    const modifier = isBelowLastItem ? 1 : 0;

                    newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
               }

               return {
                    ...prev,
                    [activeContainer]: [
                         ...prev[activeContainer].filter((item) => item !== active.id)
                    ],
                    [overContainer]: [
                         ...prev[overContainer].slice(0, newIndex),
                         items[activeContainer][activeIndex],
                         ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                    ]
               };
          });
     }

     function handleDragEnd(event) {
          const { active, over } = event;
          const { id } = active;
          const { id: overId } = over;

          const activeContainer = findContainer(id);
          const overContainer = findContainer(overId);

          if (
               !activeContainer ||
               !overContainer ||
               activeContainer !== overContainer
          ) {
               return;
          }

          const activeIndex = items[activeContainer].indexOf(active.id);
          const overIndex = items[overContainer].indexOf(overId);

          if (activeIndex !== overIndex) {
               setItems((items) => ({
                    ...items,
                    [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
               }));
          }

          setActiveId(null);
     }
}
