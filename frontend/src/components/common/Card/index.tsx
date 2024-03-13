import { Flex, BoxProps } from "@chakra-ui/react";
import React from "react";
import { animated, useSpring } from "react-spring";

const useFadeUp = () => {
  return useSpring({
    to: { opacity: 1, transform: "translate3d(0,0px,0)" },
    from: { opacity: 0, transform: "translate3d(0,30px,0)" },
  });
};

export type CardProps = BoxProps & {
  onClick?: () => void;
  color?: string;
};

const AnimatedFlex = animated(Flex);

const Card: React.FC<CardProps> = ({ onClick, children, ...rest }) => {
  const fade = useFadeUp();
  return (
    <AnimatedFlex
      style={fade}
      onClick={onClick}
      borderWidth={1}
      borderRadius="10px"
      boxShadow="0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0,0,0,.12)"
      {...rest}
    >
      {children}
    </AnimatedFlex>
  );
};

Card.defaultProps = {
  width: "auto",
  border: "0",
  boxShadow: "none",
  onClick: () => false,
  flexDirection: "column",
};

export default Card;
