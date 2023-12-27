import {
  defineStyleConfig,
  extendTheme,
  ThemeConfig,
  withDefaultSize,
} from '@chakra-ui/react'
import { menuAnatomy, sliderAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const {
  definePartsStyle: defineMenuPartsStyle,
  defineMultiStyleConfig: defineMenuMultiStyleConfig,
} = createMultiStyleConfigHelpers(menuAnatomy.keys)

const {
  definePartsStyle: defineSliderPartsStyle,
  defineMultiStyleConfig: defineSliderMultiStyleConfig,
} = createMultiStyleConfigHelpers(sliderAnatomy.keys)

const config: ThemeConfig = {
  useSystemColorMode: false,
}

export const theme = extendTheme(
  {
    config,
    colors: {
      gray: {},
    },
    styles: {
      global: () => ({
        body: {
          bg: `var(--background-color)`,
        },
      }),
    },
    components: {
      Menu: defineMenuMultiStyleConfig({
        baseStyle: defineMenuPartsStyle({
          button: {
            _active: {
              borderColor: `var(--primary-color)`,
              background: `transparent`,
            },
          },
          list: {
            bg: `var(--background-tertiary-color)`,
            padding: 1,
            borderRadius: `lg`,
            border: `none`,
          },
          item: {
            fontSize: `md`,
            borderRadius: `md`,
            bg: `transparent`,
            px: 3,
            py: 3,
            _hover: {
              bg: `var(--background-hover-color)`,
            },
            _focus: {
              bg: `transparent`,
            },
          },
        }),
      }),
      Button: defineStyleConfig({
        baseStyle: { borderRadius: `lg`, fontWeight: 400, fontSize: `md` },
      }),
      Slider: defineSliderMultiStyleConfig({
        baseStyle: defineSliderPartsStyle({
          filledTrack: {
            bg: `var(--primary-color)`,
          },
        }),
      }),
    },
  },
  withDefaultSize({
    size: `lg`,
    components: [`Button`, `IconButton`, `Menu`],
  }),
)
