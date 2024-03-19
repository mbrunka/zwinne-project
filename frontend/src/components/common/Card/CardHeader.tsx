import { Flex, FlexProps } from "@chakra-ui/react";
import * as React from "react";

type CardHeaderProps = FlexProps;

const CardHeader: React.FC<CardHeaderProps> = ({ children, ...rest }) => {
  return (
    <Flex borderBottom="0" {...rest}>
      {children}
    </Flex>
  );
};

export default CardHeader;

CardHeader.defaultProps = {
  p: 4,
  flexDirection: "column"
};
