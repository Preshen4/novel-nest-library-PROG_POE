import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { ENDPOINTS, createAPIEndpoint } from '.';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useStateContext from '../hooks/useStateContext';
// Drag and drop 
// https://codesandbox.io/s/react-beautiful-dnd-board-base-0dv9b
// Author: Michael Miller
const ReplacingBook = () => {
     // State declarations
     const [open, setOpen] = useState(false); // Dialog open state
     const [dragAndDropEnabled, setDragAndDropEnabled] = useState(true); // Drag and drop enable/disable
     const [score, setScore] = useState(0); // User score
     const { context } = useStateContext(); // User context
     const [disableButton, setDisableButton] = useState(false); // Button disable state
     const [quizData, setQuizData] = useState([]); // Quiz data
     const [timer, setTimer] = useState(0); // Timer value
     const [timerRunning, setTimerRunning] = useState(false); // Timer running state
     const [data, setData] = useState([]); // Data for the MaterialReactTable
     const [isError, setIsError] = useState(false); // Error state
     const [isLoading, setIsLoading] = useState(false); // Loading state
     const [isRefetching, setIsRefetching] = useState(false); // Refetching state
     const [rowCount, setRowCount] = useState(0); // Row count for MaterialReactTable

     // Function to fetch game data
     const getGame = async () => {
          try {
               const { data } = await createAPIEndpoint(ENDPOINTS.replacingBookQuiz).getReplacingBookData();
               setQuizData(data);
               setData(data.CallNumber);
               setRowCount(data.length);
          } catch (error) {
               handleError(error);
          } finally {
               setIsLoading(false);
               handleStartTimer();
          }
     };

     // Function to handle errors
     const handleError = (error) => {
          setIsError(true);
          setIsLoading(true);
          setIsRefetching(false);
          console.error(error);
          throw error;
     };

     // Function to open the dialog
     const handleOpen = () => {
          setOpen(true);
     };

     // Function to close the dialog
     const handleClose = () => {
          setOpen(false);
     };

     // Function to start the timer
     const handleStartTimer = () => {
          setTimer(0);
          setTimerRunning(true);
     };

     // Function to stop the timer
     const handleStopTimer = () => {
          setTimerRunning(false);
     };

     // Fetch game data when the component mounts
     useEffect(() => {
          const fetchData = async () => {
               await getGame();
          };
          fetchData();
     }, []);

     // Timer interval effect
     useEffect(() => {
          let timerInterval;
          if (timerRunning) {
               timerInterval = setInterval(() => {
                    setTimer((prevTimer) => prevTimer + 1);
               }, 1000);
          } else {
               clearInterval(timerInterval);
          }

          return () => {
               clearInterval(timerInterval);
          };
     }, [timerRunning]);

     // Function to handle row reordering in the table
     const handleRowReorder = ({ table, draggingRow, hoveredRow }) => {
          if (hoveredRow && draggingRow) {
               const newData = [...data];
               newData.splice(hoveredRow.index, 0, newData.splice(draggingRow.index, 1)[0]);
               setData(newData);
               setQuizData((prevData) => ({
                    ...prevData,
                    CallNumber: newData.map((item) => item.CallNumber),
               }));
          }
     };

     // Define columns for MaterialReactTable
     const columns = useMemo(() => [
          {
               accessorFn: (row) => row,
               accessorKey: 'CallNumber',
               header: 'Call Number',
          },
     ], []);

     // Function to handle button click for getting data
     const handleGetDataButtonClick = async () => {
          try {
               const { data: resData } = await createAPIEndpoint(ENDPOINTS.replacingBookQuiz).replacingBookCalPoints(quizData);
               setScore(resData.TotalPoints);
               const values = {
                    UserName: context.userName,
                    Score: resData.TotalPoints,
               };
               await createAPIEndpoint(ENDPOINTS.leaderBoard).addOrUpdateLeaderBoardEntry(values);
               handleOpen();
               setDragAndDropEnabled(false);
               handleStopTimer();
               setDisableButton(true);
          } catch (error) {
               console.error(error);
          }
     };

     // Function to restart the game
     const restartGame = () => {
          setOpen(false);
          getGame();
          setDragAndDropEnabled(true);
          setDisableButton(false);
          setScore(0); // Reset the score
     };

     return (
          <div>
               {/* Dialog for game submission */}
               <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
               >
                    <DialogTitle id="alert-dialog-title">
                         {"Game Submitted"}
                    </DialogTitle>
                    <DialogContent>
                         <DialogContentText id="alert-dialog-description">
                              Your score was = {score}, would you like to retry?
                         </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={restartGame} autoFocus>
                              Yes
                         </Button>
                         <Button onClick={handleClose} autoFocus>
                              No
                         </Button>
                    </DialogActions>
               </Dialog>
               {/* Timer display */}
               <div>
                    <label>Timer: {timer} seconds</label>
               </div>
               {/* MaterialReactTable for displaying data */}
               <MaterialReactTable
                    columns={columns}
                    data={data}
                    layoutMode='grid'
                    muiTableBodyRowProps={{
                         sx: {
                              backgroundColor: 'rgba(52, 210, 235, 0.1)',
                              borderRight: '1px solid rgba(224,224,224,1)',
                         },
                    }}
                    muiTableContainerProps={{
                         sx: {
                              minWidth: '700px',
                         },
                    }}
                    disableColumnFilterModes
                    enableColumnActions={false}
                    initialState={{
                         showColumnFilters: false,
                    }}
                    muiTableHeadCellProps={{
                         align: 'center',
                    }}
                    muiTableBodyCellProps={{
                         align: 'center',
                    }}
                    autoResetPageIndex={false}
                    enableRowOrdering={dragAndDropEnabled}
                    enableSorting={false}
                    getRowId={(row) => row.CallNumber}
                    muiTableBodyRowDragHandleProps={({ table }) => ({
                         onDragEnd: () => handleRowReorder({ table, ...table.getState() }),
                    })}
                    muiToolbarAlertBannerProps={
                         isError
                              ? {
                                   color: 'error',
                                   children: 'Error loading data',
                              }
                              : undefined
                    }
                    rowCount={rowCount}
                    state={{
                         isLoading,
                         showAlertBanner: isError,
                         showProgressBars: isRefetching,
                    }}
               />
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
                    disabled={disableButton}
                    onClick={handleGetDataButtonClick}
               >
                    Submit
               </Button>
          </div>
     );
};

export default ReplacingBook;
