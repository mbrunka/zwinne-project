import React from "react";
import Select, { StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const selectStyles = (isInvalid: boolean): StylesConfig => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: 3,
    padding: "5px 10px",
    boxShadow: state.isFocused ? "0" : "0",
    borderColor: isInvalid
      ? state.isFocused
        ? "#dab5b3"
        : "#dab5b3"
      : state.isFocused
      ? "#dab5b3"
      : "#dab5b3",
    transition: "border-color .25s ease-in-out",
    fontSize: "14px",
    minHeight: "1px",
    "&:hover": {
      borderColor: isInvalid
        ? state.isFocused
          ? "#dab5b3"
          : "#dab5b3"
        : state.isFocused
        ? "#dab5b3"
        : "#dab5b3",
    },
  }),
  input: (provided) => ({
    ...provided,
    paddingTop: "2px",
    paddingBottom: "2px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#212121",
  }),
  valueContainer: (provided) => ({
    ...provided,
    lineHeight: 1.15,
    padding: "0px",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 250ms";

    return { ...provided, opacity, transition };
  },
  indicatorSeparator: () => ({
    width: "5px",
    height: "100%",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "0px",
    transform: state.isFocused ? "rotate(180deg)" : "rotate(0deg)",
    color: state.isFocused ? "#000000" : "#000000",
    "&:hover": {
      color: state.isFocused ? "#000000" : "#000000",
    },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    padding: "0px",
    color: state.isFocused ? "#929292" : "#929292",
    transition: "color .15s ease-in-out",
    "&:hover": {
      color: state.isFocused ? "#000000" : "#000000",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    background: "#F4F4F4",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    padding: "3px",
    paddingLeft: "6px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderLeftWidth: "1px",
    borderLeftColor: "#cbd5e0",
    borderRadius: 5,
    marginLeft: ".25rem",
    "&:hover": {
      background: "#e0e0de",
      color: "#000000",
    },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: "5px",
    boxShadow: "none",
    border: 1,
    borderRadius: 5,
    zIndex: 9,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "5px",
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected
      ? "#FFFFFF"
      : state.isFocused
      ? "#FFFFFF"
      : "#000000",
    backgroundColor: state.isSelected
      ? "#5c5d5e"
      : state.isFocused
      ? "#813531"
      : "#FFFFFF",
    ":active": {
      backgroundColor: state.isSelected
        ? "#813531"
        : state.isFocused
        ? "#813531"
        : "#FFFFFF",
    },
    fontSize: "14px",
    lineHeight: 1.15,
    padding: "5px 10px",
    borderRadius: 0,
    transitionTimingFunction: "ease-in-out",
    transitionDuration: ".25s",
    transitionProperty:
      "background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter",
    cursor: "pointer",
    opacity: state.isDisabled ? 0.4 : 1,
  }),
  group: (provided) => ({
    ...provided,
    padding: 0,
    margin: 0,
    "&:first-of-type": {
      marginTop: "-.5rem",
    },
  }),
  groupHeading: (provided) => ({
    ...provided,
    padding: ".5rem",
    paddingBottom: ".25rem",
    margin: 0,
    color: "#5c5d5e",
    fontSize: "11px",
  }),
});

const SelectAdvanced = React.forwardRef(
  (
    {
      isInvalid = false,
      menuPlacement="bottom",
      ...rest
    }: {
      isInvalid?: boolean;
      menuPlacement?: "bottom" | "top",
      [x: string]: unknown;
    },
    ref
  ): React.ReactElement => {
    return (
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        styles={selectStyles(isInvalid)}
        placeholder="Choose"
        noOptionsMessage={() => "No options"}
        components={animatedComponents}
        menuPlacement={menuPlacement}
        ref={ref}
        {...rest}
      />
    );
  }
);

SelectAdvanced.displayName = "SelectAdvanced";

export default SelectAdvanced;
