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
import { useAppContext } from '../../providers/AppProvider';

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
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const refresh = useCallback(async () => {
    try {
      setData(await loadData());
      setErrorMessage(undefined);
    } catch (e) {
      setErrorMessage('Network error.');
    } finally {
      setShowLoading(false);
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

  }, [refresh, refreshIntervalSeconds]);

  // supports the ability to refresh all data lists within the app
  // TODO this was done as a quick and janky way to keep blockchain state
  // for demo purposes.  We should have better app state in a refactor
  const { refreshFlag } = useAppContext();
  const [ refreshFlagState, setRefreshFlagstate ] = useState<boolean>(refreshFlag);
  useEffect(() => {
    if (refreshFlagState !== refreshFlag) {
      // call refresh in 5 seconds...
      // the requests list can take quite a while after updating
      // to get the correct state from the contract
      setTimeout(()=>{
        refresh();
      }, 5000);
      setRefreshFlagstate(refreshFlag);
    }
  }, [refresh, refreshFlag, refreshFlagState]);

  const rowHeight = remToPx(rowHeightRem);
  
  const empty = data.length === 0;
   
  return (
    <Box {...rest}>
      {empty && showLoading ?
        <DataLoading />
        : empty ? 
          <EmptyList 
            emptyMessage={emptyMessage} 
            errorMessage={errorMessage} 
            refresh={() => {
              setShowLoading(true);
              refresh();
            }
            }/> : 
          <PullRefresh h={rest.h} onRefresh={refresh}>
            <AutoSizer>
              {({ height, width }: { height: number, width: number }) => (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemCount={data.length}
                  itemSize={rowHeight}
                >
                  {({ index, style }: { index: number, style: CSSProperties }) => (
                    <RowElement style={style} data={data[index]} />
                  )}
                </FixedSizeList>
              )}
            </AutoSizer>
          </PullRefresh>
      }
    </Box>
  );
}