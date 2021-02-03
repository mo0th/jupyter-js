import { useIsomorphicLayoutEffect } from '#src/hooks'
// import debounce from '#src/utils/debounce'
import { Box, BoxProps, Center, Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { GrDrag } from 'react-icons/gr'
import { MdDragHandle } from 'react-icons/md'

interface ResizableProps {
  minWidth?: BoxProps['minWidth']
  maxWidth?: BoxProps['maxWidth']
  minHeight?: BoxProps['minHeight']
  maxHeight?: BoxProps['maxHeight']
  defaultRatio?: number
  left: ReactNode
  right: ReactNode
}

const RESIZE_BAR_SIZE = 4

const Resizable: React.FC<ResizableProps> = ({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  defaultRatio = 0.5,
  left,
  right,
}) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const leftRef = useRef<HTMLDivElement>()
  const containerRef = useRef<HTMLDivElement>()
  const dragBarColor = useColorModeValue('purple.100', 'purple.600')
  const dragBarHoverColor = useColorModeValue('purple.200', 'purple.500')
  const dragHandleColor = useColorModeValue('purple.900', 'purple.50')

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current && !width) {
      const ratio = defaultRatio > 1 ? 1 : defaultRatio < 0 ? 0 : defaultRatio
      setWidth(containerRef.current.clientWidth * Math.max(Math.min(ratio, 1), 0))
      setHeight(containerRef.current.clientHeight)
    }
  }, [])

  // useEffect(() => {
  //   const handleResize = debounce(() => {
  //     console.log(width, leftRef.current?.clientWidth, containerRef.current?.clientWidth)
  //   }, 100)
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  // East-West Dragging
  const [EWDragging, setEWDragging] = useState(false)
  useEffect(() => {
    if (!EWDragging) return

    const handleResize = (event: MouseEvent) => {
      setWidth(event.pageX - leftRef.current!.getBoundingClientRect().x)
    }

    const handleDragEnd = () => {
      setEWDragging(false)
    }

    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', handleDragEnd)

    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [EWDragging])
  const handleEWDragStart = () => {
    setEWDragging(true)
  }

  // East-West Dragging
  const [NSDragging, setNSDragging] = useState(false)
  useEffect(() => {
    if (!NSDragging) return

    const handleResize = (event: MouseEvent) => {
      // https://stackoverflow.com/a/50310297
      const rect = containerRef.current!.getBoundingClientRect()
      const containerY = window.pageYOffset + rect.top
      setHeight(event.pageY - containerY)
    }

    const handleDragEnd = () => {
      setNSDragging(false)
    }

    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', handleDragEnd)

    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [NSDragging])
  const handleNSDragStart = () => {
    setNSDragging(true)
  }

  const dragging = EWDragging || NSDragging

  return (
    <Flex
      ref={containerRef as any}
      position="relative"
      minH={minHeight}
      maxH={maxHeight}
      style={{ height: height ? `${height}px` : 'auto' }}
    >
      <Box
        position="absolute"
        left={0}
        top={0}
        right={0}
        bottom={0}
        opacity={dragging ? 1 : 0}
        bg="transparent"
        style={{ backdropFilter: 'blur(5px)' }}
        transition="opacity 150ms ease-in-out"
        zIndex={2}
        pointerEvents={dragging ? 'initial' : 'none'}
      />
      <Box
        minWidth={minWidth}
        maxWidth={maxWidth}
        position="relative"
        ref={leftRef as any}
        style={{ width: `${width}px` }}
        pr={RESIZE_BAR_SIZE / 2}
        pb={RESIZE_BAR_SIZE / 2}
      >
        {left}
        <Center
          position="absolute"
          right={0}
          top={0}
          bottom={RESIZE_BAR_SIZE / 2}
          w={RESIZE_BAR_SIZE}
          cursor="col-resize"
          transform="translateX(50%)"
          bg={dragBarColor}
          _hover={{ bg: dragBarHoverColor }}
          color={dragHandleColor}
          transition="all 200ms"
          onMouseDown={handleEWDragStart}
          zIndex={3}
          flexDirection="column"
        >
          <Icon transform="rotate(90deg)" as={MdDragHandle} boxSize={RESIZE_BAR_SIZE * 2} />
        </Center>
      </Box>
      <Box
        pl={RESIZE_BAR_SIZE / 2}
        pb={RESIZE_BAR_SIZE / 2}
        minWidth={minWidth}
        maxWidth={maxWidth}
        flex="1"
      >
        {right}
      </Box>
      <Center
        position="absolute"
        right={0}
        left={0}
        bottom={0}
        h={RESIZE_BAR_SIZE}
        cursor="row-resize"
        transform="translateY(50%)"
        bg={dragBarColor}
        _hover={{ bg: dragBarHoverColor }}
        color={dragHandleColor}
        transition="all 200ms"
        onMouseDown={handleNSDragStart}
        zIndex={3}
      >
        <Icon as={MdDragHandle} boxSize={RESIZE_BAR_SIZE * 2} />
      </Center>
    </Flex>
  )
}

export default Resizable
