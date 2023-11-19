import { useEffect } from 'react';
import { ENDPOINTS, createAPIEndpoint } from '.';
import ResponsiveAppBar from './ResponsiveAppBar'

export default function Dashboard() {
     const fetchData = async () => {
          try {
               // Assuming createAPIEndpoint returns the correct object based on the endpoint
               await createAPIEndpoint(ENDPOINTS.findCallNumber)
                    .createTree()
          } catch (error) {
               console.error("Can't create tree", error);
          }
     };
     useEffect(() => {
          // Fetch data when the component mounts
          fetchData();
     }, []);
     return (
          <div>
               <ResponsiveAppBar />
          </div>

     )
}
