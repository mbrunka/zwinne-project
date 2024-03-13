import { extendTheme } from "@chakra-ui/react";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = {
   sm: "40em",
   md: "52em",
   lg: "64em",
   xl: "80em",
};

const theme = extendTheme({
   colors: {
      black: "#16161D",
      white: "#fff",
      background: { light: "#F0EBEA", medium: "#E3DAD8" },
      gray: {
         800: "#212121",
         700: "#5c5d5e",
         600: "#5C5D5E",
         500: "#8f9091",
         400: "#b9b9b9",
         300: "#e0e0de",
         200: "#efeeee",
         100: "#F4F4F4",
      },
      blue: {
         "100": "#e0f5fe",
         "600": "#00aef3",
         "700": "#039BD9",
         "800": "#0688BE",
      },
      primary: {
         "100": "#C48986",
         "200": "#AC6F6C",
         "600": "#813531",
         "700": "#591E1B",
      },
      secondary: {
         "200": "#49805E",
         "600": "#245235",
      },
   },
   fonts,
   breakpoints,
   styles: {
      global: {
         body: {
            margin: 0,
            padding: 0,
            fontSize: "15px",
            bg: "white",
            color: "black",
            lineHeight: 1.7,
            fontWeight: "500",
         },
         a: {
            transition: "all .25s ease-in-out",
            textDecoration: "none",
         },
         img: {
            maxW: "100%",
         },
         ".chakra-modal__body": {
            "input, textarea, .react-select__control, .react-select__control:hover, .chakra-checkbox__control":
            {
               borderColor: "gray.300",
            },
            ".react-select__menu": {
               boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            },
         },
      },
   },
   components: {
      Button: {
         baseStyle: {
            transition: "all .25s ease-in-out",
            textTransform: 'capitalize',
            textAlign: "center",
            borderRadius: 4,
            color: "white",
            letterSpacing: "2px",
            fontWeight: "normal",
            _disabled: {
               pointerEvents: "none",
               cursor: "default",
            },
         },
         sizes: {
            md: {
               height: "auto",
               p: "0.5rem 1.5rem",
               fontSize: "16px",
               minWidth: '6rem',
               lineHeight: 1.2,
            },
            lg: {
               minWidth: '7rem'
            },
         },
         variants: {
            solid: {
               bg: "primary.600",
               color: "white",
               _hover: {
                  bg: "primary.700",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
               },
               _groupHover: {
                  bg: "primary.700",
               },
               _focus: {
                  boxShadow: "none",
                  bg: "primary.700",
               },
               _active: {
                  bg: "primary.700",
               },
               _groupActive: {
                  bg: "primary.700",
               },
            },
            ghost: {
               color: 'primary.600',
               fontWeight: '600',
               p: '1rem',
               _hover: {
                  bg: 'opaque',
                  transform: 'scale(1.04)',
                  transition: 'all 150ms ease-in-out'
               },
               _focus: {
                  bg: 'opaque',
               },
               _active: {
                  bg: 'opaque',
               },
            },
            link: {
               color: 'primary.600',
               fontWeight: '600',
               textTransform: 'none',
               fontSize: '18px',
               letterSpacing: '1.2px',
            }
         },
      },
      Menu: {
         parts: ["item", "command", "list", "button", "groupTitle", "divider"],
         baseStyle: {
            item: {
               fontSize: "14px",
               color: "primary.600",
               borderRadius: "0px",
               bg: 'opaque',
               px: "1rem",
               py: '.5rem',
               _hover: {
                  transform: 'scale(1.03)',
                  transition: 'all 150ms ease-in-out',
                  color: "primary.700",
               },
               _active: {
                  // bg: "primary.200",
               },
               _focus: {
                  // bg: "primary.200",
               },
            },
            list: {
               borderRadius: 0,
               boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
               outline: "none",
               border: 0,
               minW: "14rem",
               overflow: 'hidden'
            },
         },
      },
      Popover: {
         parts: ["popper", "content", "header", "body", "footer", "arrow"],
         baseStyle: {
            content: {
               boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
               borderWidth: 0,
               _focus: {
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
               },
            },
            body: {
               fontSize: "14px",
               px: "15px",
            },
         },
      },
      Heading: {
         baseStyle: {
            textTransform: 'capitalize',
            lineHeight: 'auto'
         },
         sizes: {
            sm: {
               fontWeight: "600",
               fontSize: "1.25rem",
               letterSpacing: "0.2px",
            },
            md: {
               color: "gray.500",
               paddingLeft: "20px",
               fontSize: "1.5rem",
               letterSpacing: "1px",
               fontWeight: "normal",
               mt: 0,
               borderLeftWidth: "2px",
               borderColor: "secondary.600",
            },
            lg: {
               letterSpacing: "1px",
               fontWeight: "normal",
               mt: 0,
               fontSize: "2rem",
            },
            mdAllegro: {
               color: "allegro",
               paddingLeft: "20px",
               fontSize: "1.5rem",
               letterSpacing: "1px",
               fontWeight: "normal",
               mt: 0,
               borderLeftWidth: "2px",
               borderColor: "allegro",
            },
         },
         variants: {
            gray: {
               color: "gray.700",
               fontSize: "15px",
            },
            simple: {
               color: "gray.700",
               borderLeft: "0px solid #ffffff",
               paddingLeft: "0px",
               marginBottom: "10px",
               fontSize: "12px",
            },
         },
      },
      Breadcrumb: {
         parts: ["link", "separator"],
         baseStyle: {
            link: {
               color: "gray.700",
               fontWeight: "500",
               fontSize: "22px",
               _hover: {
                  textDecoration: "none",
               },
               _focus: {
                  boxShadow: "none",
               },
            },
         },
      },
      Input: {
         parts: ["field", "addon"],
         sizes: {
            md: {
               addon: {
                  fontSize: "16px",
               },
               field: {
                  fontSize: "16px",
                  padding: "7px 10px",
                  borderRadius: "4px",
                  lineHeight: "1.2",
               },
            },
         },
         variants: {
            unstyled: {
               field: {
                  padding: "0.5rem",
                  fontWeight: '400',
                  backgroundColor: "#FFFFFF",
                  borderWidth: "1px",
                  borderColor: "primary.100",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  _disabled: {
                     bg: "gray.100",
                  },
                  _readOnly: {
                     cursor: "default",
                     pointerEvents: "none",
                  },
                  _invalid: {
                     borderColor: "primary.700",
                  },
                  _focus: {
                     borderColor: "primary.600",
                     boxShadow: "0px 4px 8px hsla(3, 30%, 40%, 0.3)",
                  }
               },
            },
         },
         defaultProps: {
            variant: "unstyled",
         },
      },
      NumberInput: {
         parts: ["root", "field", "stepperGroup", "stepper"],
         baseStyle: {
            stepper: {
               borderColor: "gray.300",
               _active: {
                  bg: "gray.300",
               },
            },
         },
         sizes: {
            md: {
               field: {
                  fontSize: "14px",
                  py: "10px",
                  pl: "15px",
                  borderRadius: "4px",
                  lineHeight: "1.2",
               },
               stepper: {
                  fontSize: "8px",
                  _first: {
                     borderTopRightRadius: "2px",
                  },
                  _last: {
                     borderBottomRightRadius: "2px",
                  },
               },
            },
         },
         variants: {
            unstyled: {
               field: {
                  backgroundColor: "#FFFFFF",
                  borderWidth: "1px",
                  borderColor: "primary.100",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  _focus: {
                     borderColor: "primary.600",
                     boxShadow: "0px 4px 8px hsla(3, 30%, 40%, 0.3)",
                  },
                  _disabled: {
                     bg: "gray.100",
                  },
                  _readOnly: {
                     cursor: "default",
                     pointerEvents: "none",
                  },
                  _invalid: {
                     borderColor: "primary.600",
                  },
               },
            },
         },
         defaultProps: {
            variant: "unstyled",
         },
      },
      Select: {
         parts: ["field", "icon"],
         sizes: {
            md: {
               field: {
                  fontSize: "16px",
                  padding: "7px 10px",
                  borderRadius: "0",
                  lineHeight: "1.2",
               },
               stepper: {
                  fontSize: "8px",
                  _first: {
                     borderTopRightRadius: "0px",
                  },
                  _last: {
                     borderBottomRightRadius: "0px",
                  },
               },
            },
         },
         variants: {
            unstyled: {
               field: {
                  backgroundColor: "white",
                  borderWidth: "1px",
                  borderColor: "white",
                  _disabled: {
                     bg: "gray.100",
                  },
                  _readOnly: {
                     cursor: "default",
                     pointerEvents: "none",
                  },
                  _invalid: {
                     borderColor: "primary.200",
                  },
               },
            },
         },
         defaultProps: {
            variant: "unstyled",
         },
      },
      Textarea: {
         sizes: {
            md: {
               fontSize: "16px",
               padding: "7px 10px",
               borderRadius: "0",
               lineHeight: "1.2",
            },
         },
         variants: {
            unstyled: {
               backgroundColor: "#FFFFFF",
               borderWidth: "1px",
               borderColor: "primary.200",
               _disabled: {
                  bg: "gray.100",
               },
               _readOnly: {
                  cursor: "default",
                  pointerEvents: "none",
               },
               _invalid: {
                  borderColor: "primary.600",
               },
            },
         },
         defaultProps: {
            variant: "unstyled",
         },
      },
      Divider: {
         baseStyle: {
            borderColor: "gray.400",
         },
      },
      FormLabel: {
         baseStyle: {
            letterSpacing: "1px",
            display: "block",
            mr: 0,
            mb: "5px",
            pb: 0,
            fontSize: "16px",
            fontWeight: "normal",
         },
         variants: {
            simple: {
               textTransform: "none",
               letterSpacing: "0",
               mb: "0",
               ml: "10px",
            },
         },
      },
      FormError: {
         parts: ["text", "icon"],
         baseStyle: {
            text: {
               marginTop: "5px",
               fontSize: "16px",
               color: "red.500",
            },
         },
      },
      Progress: {
         parts: ["label", "track"],
         baseStyle: {
            track: {
               borderRadius: "4px",
            },
         },
      },
      Accordion: {
         baseStyle: {
            container: {
               borderColor: "primary.200",
            },
         },
      },
      Checkbox: {
         parts: ["container", "control", "label", "icon"],
         baseStyle: {
            control: {
               borderRadius: "0",
               transition: "all .25s ease-in-out",
               borderWidth: "1px",
               borderColor: "primary.600",
               backgroundColor: "white",
               _focus: {
                  boxShadow: "none",
               },
               _disabled: {
                  bg: "gray.100",
                  borderColor: "gray.100",
                  cursor: "default",
               },
               _checked: {
                  bg: "primary.600",
                  borderColor: "primary.600",
                  _hover: {
                     bg: "primary.600",
                     borderColor: "primary.600",
                  },
                  _focus: {
                     borderColor: "primary.600",
                  },
               },
            },
            container: {
               maxWidth: "100%",
            },
            label: {
               lineHeight: "1.4",
               ml: "10px",
               maxWidth: "calc(100% - 30px)",
               _disabled: {
                  cursor: "default",
               },
            },
         },
         sizes: {
            md: {
               control: {
                  w: "20px",
                  h: "20px",
               },
               label: {
                  fontSize: "16px",
               },
            },
         },
      },
      Switch: {
         baseStyle: {
            track: {
               bg: 'gray.400',
               _checked: {
                  bg: 'primary.600',
               },
            },
         },
         sizes: {
            md: {
               control: {
                  w: "20px",
                  h: "20px",
               },
               label: {
                  fontSize: "16px",
               },
            },
         },
      },
      Radio: {
         parts: ["container", "control", "label"],
         baseStyle: {
            control: {
               borderWidth: "1px",
               borderColor: "gray.300",
               transition: "all .25s ease-in-out",
               _hover: {
                  bg: "white",
                  borderColor: "gray.300",
               },
               _checked: {
                  color: "primary.600",
                  borderColor: "gray.300",
                  bg: "white",
                  _hover: {
                     bg: "white",
                     borderColor: "gray.300",
                  },
               },
               _focus: {
                  boxShadow: "none",
               },
            },
            container: {
               maxWidth: "100%",
            },
            label: {
               lineHeight: "1.4",
               ml: "10px",
               maxWidth: "calc(100% - 30px)",
               _disabled: {
                  cursor: "default",
               },
            },
         },
         sizes: {
            md: {
               control: {
                  w: "20px",
                  h: "20px",
               },
               label: {
                  fontSize: "16px",
               },
            },
         },
      },
      Tabs: {
         parts: ["root", "tablist", "tab", "tabpanel", "indicator"],
         baseStyle: {
            fontSize: "16px",
            tabpanel: {
               px: 0,
               pb: 0,
               pt: "1rem",
            },
            tab: {
               borderTopRadius: "4px",
               _focus: {
                  color: "primary.600",
                  boxShadow: "none",
                  bg: "gray.100",
               },
               _selected: {
                  color: "primary.600",
                  bg: "gray.100",
               },
            },
         },
         variants: {
            enclosed: {
               tab: {
                  borderTopRadius: "4px",
                  _focus: {
                     color: "primary.600",
                     boxShadow: "none",
                     bg: "gray.100",
                  },
                  _selected: {
                     color: "primary.600",
                     bg: "gray.100",
                  },
               },
            },
         },
         defaultProps: {
            variant: "enclosed",
         },
      },
      Modal: {
         parts: [
            "dialogContainer",
            "dialog",
            "header",
            "closeButton",
            "body",
            "footer",
         ],
         baseStyle: {
            dialog: {
               borderRadius: ".25rem",
            },
            header: {
               borderBottomWidth: 0,
               fontWeight: "600",
               fontSize: "20px",
               letterSpacing: "1px",
               color: "secondary.600",
               pt: "15px",
               pb: 0,
               mb: 0,
            },
            body: {
               py: "25px",
            },
            footer: {
               borderTopWidth: 1,
               borderTopColor: "gray.300",
               borderTopStyle: "solid",
            },
         },
      },
      CloseButton: {
         baseStyle: {
            color: "gray.500",
            _focus: {
               boxShadow: "none",
               color: "black",
            },
            _hover: {
               bg: "transparent",
               color: "black",
            },
            _active: {
               bg: "transparent",
               color: "black",
            },
         },
      },
      Alert: {
         parts: ["container", "title", "description", "icon"],
         baseStyle: {
            container: {
               borderRadius: "4px",
               mb: "20px",
            },
         },
         defaultProps: {
            variant: "solid",
         },
      },
      Tooltip: {
         baseStyle: {
            bg: "gray.800",
            boxShadow: "none",
            color: "white",
            fontSize: "14px",
            fontWeight: "normal",
            px: "10px",
            py: "2.5px",
            borderRadius: "4px",
         },
      },
      Link: {
         baseStyle: {
            color: "#555",
            borderBottomWidth: "0px",
            borderColor: "primary.600",
            display: "inline-block",
            fontSize: "16px",
            _hover: {
               color: "#111",
               textDecoration: 'underline'
            },
            _focus: {
               boxShadow: "none",
            },
         },
      },
      Badge: {
         baseStyle: {
            px: "7.5px",
            py: "2.5px",
            borderRadius: "4px",
            fontWeight: "600",
            fontSize: "11px",
            textTransform: "none",
         },
      },
      Spinner: {
         baseStyle: {
            color: 'primary.600'
         },
      },
   },
});

export default theme;
