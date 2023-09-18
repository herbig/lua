import * as React from 'react';
import { BoxProps, Box } from '@chakra-ui/react';
import { ChangeEvent, MutableRefObject, useRef } from 'react';

interface Props extends BoxProps {
  type?: 'image' | 'any';
  onFileSelected: (file: File | null) => void;
}

export function FileSelector({children, type = 'any', onFileSelected, ...props}: Props) {
  const input = useRef() as MutableRefObject<HTMLInputElement>;
  return (
    <Box {...props} onClick={() => {
      input.current.click();
    }}>
      {children}
      <input
        ref={input}
        style={{display: 'none'}}
        type="file"
        accept={type === 'image' ? 'image/png, image/gif, image/jpeg' : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onFileSelected(event.target.files ? event.target.files[0] : null);
        }}
      />
    </Box>
  );
}