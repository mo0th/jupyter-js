import {
  Box,
  Checkbox,
  Code,
  Divider,
  Heading,
  HeadingProps,
  Image,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

interface MarkdownPreviewProps {
  markdown: string
}

const Root = styled.div`
  line-height: 1.75rem;

  ul ul,
  ul ol,
  ol ul,
  ol ol,
  li p {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  > ul > li > *:first-child,
  > ol > li > *:first-child {
    margin-top: 1.25rem;
  }

  > ul > li > *:last-child,
  > ol > li > *:last-child {
    margin-top: 1.25rem;
  }
`

const usePurple = () => useColorModeValue('purple.700', 'purple.300')

const HEADING_LEVEL_TO_PROPS = {
  1: {
    size: '2xl',
    mb: '2rem',
    lineHeight: '2.5rem',
  },
  2: {
    size: 'xl',
    mt: '3rem',
    mb: '1.5rem',
    lineHeight: '2rem',
  },
  3: {
    size: 'lg',
    mt: '2rem',
    mb: '0.75rem',
    lineHeight: '2rem',
  },
  4: {
    size: 'md',
    mt: '1.5rem',
    mb: '0.5rem',
    lineHeight: '1.5rem',
  },
  5: {
    size: 'sm',
  },
  6: {
    size: 'xs',
  },
} as Record<number, HeadingProps>

const LIST_PROPS = {
  ml: 0,
  my: 5,
}

const LinkRenderer: React.FC<any> = props => (
  <Link href={props.href} isExternal color={usePurple()}>
    {props.children}
  </Link>
)

const ImageRenderer: React.FC<any> = props => (
  <Image src={props.src} alt={props.alt} w="100%" my={8} />
)

const Break: React.FC<any> = () => (
  <Divider borderBottomWidth="2px" borderColor={usePurple()} my={8} />
)

const renderers = {
  thematicBreak: Break,
  paragraph: props => <Text {...props} my={4} />,
  heading: props => (
    <Heading as={`h${props.level}` as any} {...HEADING_LEVEL_TO_PROPS[props.level]}>
      {props.children}
    </Heading>
  ),
  link: LinkRenderer,
  image: ImageRenderer,
  linkReference: LinkRenderer,
  imageReference: ImageRenderer,
  blockquote: props => (
    <Box
      as="blockquote"
      borderLeft="2px"
      borderLeftColor={usePurple()}
      fontStyle="italic"
      pl={6}
      my={6}
    >
      {props.children}
    </Box>
  ),
  table: props => <Table>{props.children}</Table>,
  tableHead: props => <Thead>{props.children}</Thead>,
  tableBody: props => <Tbody>{props.children}</Tbody>,
  tableRow: props => <Tr>{props.children}</Tr>,
  tableCell: props => {
    if (props.isHeader) return <Th textAlign={props.align ?? 'left'}>{props.children}</Th>
    return <Td textAlign={props.align ?? 'left'}>{props.children}</Td>
  },
  root: Root,
  list: props => {
    if (props.ordered) {
      return <OrderedList {...LIST_PROPS}>{props.children}</OrderedList>
    }
    return <UnorderedList {...LIST_PROPS}>{props.children}</UnorderedList>
  },
  listItem: props => {
    const dotColor = usePurple()
    const isTask = props.checked !== null
    const beforeStyles = props.ordered
      ? {
          content: 'counter(list-item, decimal) "."',
        }
      : !isTask
      ? { content: '""', bg: dotColor, top: 3, width: '6px', height: '6px', rounded: 'full' }
      : {}

    return (
      <ListItem
        _before={{
          position: 'absolute',
          left: 0,
          ...beforeStyles,
        }}
        position="relative"
        pl={8}
        listStyleType="none"
      >
        {isTask && (
          <Box position="absolute" left={0} top="0.375rem">
            <Checkbox isChecked={props.checked} isReadOnly />
          </Box>
        )}
        {props.children}
      </ListItem>
    )
  },
  inlineCode: props => (
    <Code
      lineHeight={6}
      _before={{ content: '"`"' }}
      _after={{ content: '"`"' }}
      colorScheme="purple"
    >
      {props.children}
    </Code>
  ),
  code: props => {
    // console.log('code', props)
    return (
      <Box as="code">
        <Box as="pre">{props.value}</Box>
      </Box>
    )
  },
} as Record<string, React.ComponentType<any>>

const plugins = [gfm]

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  return (
    <Box maxW="800px" mx="auto">
      <ReactMarkdown source={markdown} plugins={plugins} renderers={renderers} />
    </Box>
  )
}

export default MarkdownPreview
