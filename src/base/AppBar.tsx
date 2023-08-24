import * as React from 'react'
import {
  BoxProps,
  Divider,
  Flex,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';

export const APPBAR_HEIGHT = '4rem';

export function AppBar({ ...props }: BoxProps) {
  return (
    <Flex {...props} flexDirection="column" h={APPBAR_HEIGHT}>
      <Flex h="100%" ps="1rem" pe="0.5rem" alignItems="center">
        <Text as="b">Lua</Text>
        <Spacer />
        <ColorModeSwitcher />
      </Flex>
      <Divider />
    </Flex>
  )
}