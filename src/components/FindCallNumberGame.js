import React from 'react';
import ResponsiveAppBar from "./ResponsiveAppBar";
import FindCallNumber from "./FindCallNumber"
import Center from './Center';

export default function FindCallNumberGame() {

     return (
          <div>
               <ResponsiveAppBar />
               <Center>
                    <FindCallNumber />
               </Center>
          </div>
     )
}