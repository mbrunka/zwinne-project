import React from "react";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Popover,
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  InputRightElement,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { ColorPicker as ColorPalette, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useController, Control } from "react-hook-form";
import { X } from "react-feather";

type Props = {
  name: string;
  header?: string;
  control: Control<any>;
};

const COLOR_IN_THE_MIDDLE_OF_PICKER = "#46808c";

const ColorPicker = ({ control, name, header }: Props): React.ReactElement => {
  const {
    field: { ref, onChange, value },
  } = useController({
    name,
    control,
  });

  const [color, setColor] = useColor("#123123");

  return (
    <Popover>
      <PopoverTrigger>
        <InputGroup>
          <InputLeftAddon>
            <Button
              as="span"
              backgroundColor={value || COLOR_IN_THE_MIDDLE_OF_PICKER}
              pointerEvents="none"
              minW="none"
              w="18px"
              h="18px"
              borderColor="gray.400"
              borderWidth="1px"
              variant="unstyled"
            />
          </InputLeftAddon>
          <Input type="text" ref={ref} value={value} onChange={() => {}} />
          <InputRightElement mt="4px" mr="4px">
            <IconButton
              aria-label="Clear"
              icon={<Icon as={X} w="20px" h="20px" />}
              size="xs"
              onClick={(e) => {
                e.preventDefault();
                onChange("");
              }}
            />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{header || name}</PopoverHeader>
        <PopoverBody>
          <ColorPalette
            width={296}
            height={200}
            color={color}
            onChange={(color) => {
              onChange(color.hex);
              setColor(color);
            }}
            hideInput={["rgb", "hsv"]}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
