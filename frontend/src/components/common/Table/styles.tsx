import { Flex, IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import * as React from "react";
import {
  ColorProps,
  JustifyContentProps,
  SpaceProps,
  color,
  justifyContent,
  layout,
  space,
} from "styled-system";

export const StyledTable = styled.div<SpaceProps>`
  ${space};
  display: table;
  box-sizing: border-box;
  border-top-width: 0px;
  min-width: 100%;
  background-color: white;
`;

export const TableHead = styled.div<SpaceProps>`
  ${space};
  display: table-row-group;
  background-color: white;
`;

export const TableCell = styled<
  "div",
  // @ts-ignore
  SpaceProps & ColorProps & JustifyContentProps
>("div", {})`
  ${space};
  ${color};
  ${layout};
  ${justifyContent};
  display: table-cell;
  border-bottom-width: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  line-height: 1.4;
  vertical-align: middle;
`;

export const TableRow = styled(Flex)`
  &:nth-of-type(even) {
    background-color: #fafafa;
    transition: background-color 0.25s ease-in-out;
  }
  &:nth-of-type(odd) {
    background-color: #ffffff;
  }
  &:hover {
    cursor: pointer;
    background-color: #e9e9e9;
  }
`;

type TableIconButtonProps = SpaceProps & {
  icon: any;
  onClick:
    | ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
  isDisabled: boolean;
};

export const TableIconButton: React.FC<
  TableIconButtonProps & { children?: React.ReactNode }
> = ({ icon, onClick, isDisabled, children, ...rest }) => {
  return (
    <IconButton
      aria-label=""
      variant="ghost"
      {...rest}
      icon={icon}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {children}
    </IconButton>
  );
};
