import React from "react";
import { Flex } from "@chakra-ui/react";

type LayoutProps = {
   children: React.ReactNode;
   showSwitcher?: boolean;
};

const CleanLayout = ({ children }: LayoutProps) => {
   return (
      <Flex justify="center" height="100%">
         <Flex
            direction="column"
            justify="center"
            height="100%"
            bg="white"
            p="3rem"
            width="100%"
         >
            {children}
         </Flex>
      </Flex>
   );
};

export default CleanLayout;
