import * as React from 'react';
import {
  Box,
  BoxProps} from '@chakra-ui/react';
import { remToPx } from '../../utils/ui';
import { DataLoading } from '../base/DataLoading';
import { EmptyList } from '../base/EmptyList';
import { PullRefresh } from '../base/PullRefresh';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export interface DataListRowProps<T> { 
    // required by react-window to render properly
    style: CSSProperties
    data: T
}

export interface DataListProps<T> extends BoxProps {
    loadData: () => Promise<T[]>;
    RowElement:  (props: DataListRowProps<T>) => JSX.Element;
    rowHeightRem: number; // needed to do react-window rendering properly
    emptyMessage: string;
    refreshIntervalSeconds?: number; // optionally, set a refresh interval
}

export function DataList<T>({ loadData, emptyMessage, rowHeightRem, refreshIntervalSeconds, RowElement, ...rest }: DataListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setData(await loadData());
      setErrorMessage(undefined);
    } catch (e) {
      setErrorMessage('Network error.');
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  useEffect(() => {

    // initial data load
    refresh();

    // set the refresh interval
    if (refreshIntervalSeconds) {
      const interval = setInterval(refresh, refreshIntervalSeconds * 1000);
      return () => clearInterval(interval);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowHeight = remToPx(rowHeightRem);
  
  // react-window wrapper to do its rendering magic
  const Row = ({ index, style }: { index: number, style: CSSProperties }) => (
    <RowElement style={style} data={data[index]} />
  );

  const empty = data.length === 0;
   
  return (
    <Box {...rest}>
      {empty && isLoading ?
        <DataLoading />
        : empty ? 
          <EmptyList emptyMessage={emptyMessage} errorMessage={errorMessage} refresh={refresh} /> : 
          <PullRefresh h={rest.h} onRefresh={refresh}>
            <AutoSizer>
              {({ height, width }: { height: number, width: number }) => (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemCount={history.length}
                  itemSize={rowHeight}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          </PullRefresh>
      }
    </Box>
  );
}