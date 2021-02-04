import { mode, transparentize } from '@chakra-ui/theme-tools'
import { extendTheme, theme as defaultTheme, Theme } from '@chakra-ui/react'
import { __dev__, __is_client__ } from './constants'

interface StyleOptions {
  theme: Theme
  colorMode: 'light' | 'dark'
  colorScheme: string
  [k: string]: any
}

const { purple } = defaultTheme.colors

const theme = extendTheme({
  shadows: {
    outline: `0 0 0 3px ${purple[500]}99`,
  },
  components: {
    Button: {
      variants: {
        subtle: (props: StyleOptions) => {
          const { colorScheme: c, theme } = props

          const darkBg = transparentize(`${c}.200`, 0.12)(theme)
          const darkHoverBg = transparentize(`${c}.200`, 0.24)(theme)
          const darkActiveBg = transparentize(`${c}.200`, 0.36)(theme)

          return {
            bg: mode(`${c}.50`, darkBg)(props),
            color: mode(`${c}.700`, `${c}.200`)(props),
            _hover: {
              _disabled: {
                bg: mode(`${c}.50`, darkBg)(props),
              },
              bg: mode(`${c}.100`, darkHoverBg)(props),
            },
            _active: {
              bg: mode(`${c}.200`, darkActiveBg)(props),
            },
          }
        },
      },
      defaultProps: {
        variant: 'ghost',
        colorScheme: 'purple',
      },
    },
    Textarea: {
      baseStyle: {
        transition: `${defaultTheme.components.Textarea.baseStyle.transition}, height 0s`,
      },
    },
  },
  fonts: {
    heading: `'Poppins', ${defaultTheme.fonts.heading}`,
    body: `'Open Sans', ${defaultTheme.fonts.body}`,
  },
  styles: {
    global: (props: StyleOptions) => {
      const scrollTrack = mode(purple[50], purple[900])(props)
      const scrollThumb = purple[400]

      return {
        'html, body, #__next': {
          height: '100%',
          bg: mode('gray.50', 'gray.800')(props),
        },
        // Chrome
        '*::-webkit-scrollbar': {
          base: {},
          md: {
            width: 2,
            height: 2,
          },
        },
        '*::-webkit-scrollbar-track': {
          base: {},
          md: {
            bg: scrollTrack,
          },
        },
        '.no-track::-webkit-scrollbar-track': {
          base: {},
          md: {
            bg: 'transparent',
          },
        },
        '*::-webkit-scrollbar-thumb': {
          base: {},
          md: {
            bg: 'purple.400',
            rounded: 'full',
          },
        },
        // Firefox
        '*': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${scrollThumb} ${scrollTrack}`,
        },
        '.no-track': {
          'scrollbar-color': `${scrollThumb} transparent`,
        },
      }
    },
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
})

if (__dev__ && __is_client__) console.log(theme)

export default theme
