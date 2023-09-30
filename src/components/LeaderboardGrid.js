import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { ENDPOINTS, createAPIEndpoint } from '.';

const createLeaderboard = () => {
     return createAPIEndpoint(ENDPOINTS.leaderBoard)
          .getLeaderboard()
          .then((res) => {
               return res.data;
          });
};

const headingStyle = {
     textAlign: 'center',
     fontSize: '42px',
     fontWeight: 'bold',
     margin: '20px 0',
     color: 'white',
};

const LeaderboardGrid = () => {
     const [data, setData] = useState([]);
     const [isError, setIsError] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
     const [isRefetching, setIsRefetching] = useState(false);

     useEffect(() => {
          const fetchData = async () => {
               setIsRefetching(true);
               try {
                    const getData = await createLeaderboard();
                    setData(getData);
                    setIsError(false);
               } catch (error) {
                    setIsError(true);
                    console.error(error);
               }
               setIsLoading(false);
               setIsRefetching(false);
          };
          fetchData();
     }, []);

     const columns = useMemo(
          () => [
               {
                    accessorKey: 'UserName',
                    header: 'Username',
               },
               {
                    accessorKey: 'Score',
                    header: 'Score',
               },
          ],
          []
     );

     return (
          <div>
               <h1 style={headingStyle}>Leaderboard</h1>
               {isLoading && <div>Loading...</div>}
               {isError && <div>Error loading data</div>}
               {!isLoading && !isError && (
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
                         enableColumnActions={true}
                         muiTableHeadCellProps={{
                              align: 'center',
                         }}
                         muiTableBodyCellProps={{
                              align: 'center',
                         }}
                         autoResetPageIndex={false}
                         enableSorting={false}
                         muiToolbarAlertBannerProps={
                              isError
                                   ? {
                                        color: 'error',
                                        children: 'Error loading data',
                                   }
                                   : undefined
                         }
                         rowCount={data.length}
                         state={{
                              isLoading,
                              showAlertBanner: isError,
                              showProgressBars: isRefetching,
                         }}
                    />
               )}
          </div>
     );
};

export default LeaderboardGrid;
