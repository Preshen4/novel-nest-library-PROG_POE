import React from 'react';
import IdentifyingArea from './IdentifyingArea';
import ResponsiveAppBar from "./ResponsiveAppBar";
import Center from './Center';

export default function IdentifyingAreaGame() {

     return (
          <div>
               <ResponsiveAppBar />
               <Center>
                    <IdentifyingArea />
               </Center>
          </div>
     )
}
