import { numberInputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const {
  definePartsStyle,
  defineMultiStyleConfig
} = createMultiStyleConfigHelpers(numberInputAnatomy.keys);

const steelTargetField = definePartsStyle({
  field: {
    border: "1px solid",
    borderColor: "gray.200",
    background: "gray.50",
  },
});

export const numberInputTheme = defineMultiStyleConfig({
  variants: { primary: steelTargetField },
});