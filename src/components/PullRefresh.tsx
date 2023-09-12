import * as React from 'react';
import { BoxProps, CircularProgress, Box } from '@chakra-ui/react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { ReactElement } from 'react';

interface Props extends Omit<BoxProps, 'children'> {
    children: ReactElement;
    onRefresh: () => Promise<unknown>;
}

/**
 * A pull to refresh component, similar to Android's pull to refresh experience.
 * 
 * Wraps the given children and takes an onRefresh function, which should handle
 * the asynchronous data refreshing.
 */
export function PullRefresh({ children, onRefresh, ...props }: Props) {
  return (
    <Box h='100%' {...props}>
      <PullToRefresh 
        refreshingContent={<CircularProgress pt="1rem" size='2rem' isIndeterminate />} 
        pullingContent=''
        onRefresh={onRefresh}>
        {children}
      </PullToRefresh>
    </Box>
  );
}