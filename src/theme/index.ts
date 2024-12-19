import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5e6ff',
      100: '#dbb8ff',
      200: '#c18aff',
      300: '#a75cff',
      400: '#8e2eff',
      500: '#7500e6',
      600: '#5c00b4',
      700: '#430082',
      800: '#2a0050',
      900: '#11001f',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'xl',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-1px)',
            shadow: 'md',
          },
          _active: {
            bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
            transform: 'translateY(0)',
            shadow: 'sm',
          },
          transition: 'all 0.2s',
        }),
        ghost: {
          _hover: {
            transform: 'translateY(-1px)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
        outline: {
          _hover: {
            transform: 'translateY(-1px)',
            shadow: 'sm',
          },
          _active: {
            transform: 'translateY(0)',
            shadow: 'none',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderRadius: 'xl',
          borderWidth: '1px',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
          shadow: 'sm',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            shadow: 'md',
          },
        },
      }),
    },
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.50',
            borderRadius: 'xl',
            _hover: {
              bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
              borderColor: 'brand.500',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Select: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.50',
            borderRadius: 'xl',
            _hover: {
              bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
              borderColor: 'brand.500',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Modal: {
      baseStyle: (props: any) => ({
        dialog: {
          borderRadius: 'xl',
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        },
      }),
    },
    Drawer: {
      baseStyle: (props: any) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        },
      }),
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderRadius: 'xl',
          border: 'none',
          shadow: 'lg',
          py: 2,
        },
        item: {
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.50',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.50',
          },
        },
      }),
    },
    Tooltip: {
      baseStyle: {
        borderRadius: 'lg',
        px: 3,
        py: 2,
        bg: 'gray.900',
        color: 'white',
        shadow: 'lg',
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
});

export default theme; 