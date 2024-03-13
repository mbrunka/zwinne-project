import React from "react";
import { Flex } from "@chakra-ui/react";
import UserMenu from "./UserMenu";

const Header = (): React.ReactElement => {
   return (
      <Flex
         p="1rem"
         align="center"
         justify="end"
         h="4rem"
         position="sticky"
         top='0'
         backgroundColor="primary.600"
         zIndex={2000}
         color="gray.600"
      >
         <UserMenu />
      </Flex>
   );
};

export default Header;
