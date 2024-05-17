import { extendTheme } from '@chakra-ui/react'
import { numberInputTheme } from "./custom/NumberInput.ts";

const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: () => ({
      body: {
        bg: "",
        color: "white",
      },
    }),
  },
  components: {
    NumberInput: numberInputTheme,
  }
})

export default theme
