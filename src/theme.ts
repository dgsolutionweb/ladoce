import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  colors: {
    brand: {
      50: '#f5e6ff',
      100: '#dbb3ff',
      200: '#c180ff',
      300: '#a74dff',
      400: '#8d1aff',
      500: '#7400e6',
      600: '#5a00b3',
      700: '#400080',
      800: '#26004d',
      900: '#0d001a',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'purple',
      },
    },
  },
});

export default theme; 