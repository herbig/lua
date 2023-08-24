import * as React from 'react'
import {
  BoxProps,
  Button,
  Flex,
} from '@chakra-ui/react'
import { PrivateKeyInput } from '../components/PrivateKeyInput'
import { useState } from 'react'

export function Login({ ...props }: BoxProps) {
  const [key, setKey] = useState<string | undefined>(undefined)
  
  return (
    <Flex {...props} flexDirection="column">
      <PrivateKeyInput onKeyValidation={(privateKey) => {
        setKey(privateKey);
      }} />
      <Button disabled={!!key}>Submit</Button>
    </Flex>
  )
}