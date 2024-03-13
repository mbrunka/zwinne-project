import { Flex, FlexProps } from "@chakra-ui/react";
import * as React from "react";

type CardFooterProps = FlexProps;

const CardFooter: React.FC<CardFooterProps> = ({ children, ...rest }) => {
  return (
    <Flex borderTopWidth="1px" overflowX="hidden" overflowY="hidden" {...rest}>
      {children}
    </Flex>
  );
};

export default CardFooter;

CardFooter.defaultProps = {
  pt: ".5rem",
  pb: 0,
  border: 0,
  flexDirection: "column",
};
