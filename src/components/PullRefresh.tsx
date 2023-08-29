import * as React from 'react';
import { BoxProps, CircularProgress, Box } from '@chakra-ui/react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { ReactElement } from 'react';

interface Props extends Omit<BoxProps, 'children'> {
    children: ReactElement;
    onRefresh: () => Promise<unknown>;
}

export function PullRefresh({ children, onRefresh, ...props }: Props) {
  return (
    <Box {...props}>
      <PullToRefresh 
        refreshingContent={<CircularProgress pt="1rem" size='2rem' isIndeterminate />} 
        pullingContent=''
        onRefresh={onRefresh}>
        {children}
      </PullToRefresh>
    </Box>
  );
}