import * as React from 'react';
import { Box, ModalProps, useColorModeValue } from '@chakra-ui/react';
import { FullscreenModal } from './FullscreenModal';
import { useAppContext } from '../../AppProvider';
import { Buffer } from 'buffer';
import { CONTENT_HEIGHT } from '../../screens/main/AppContent';

export const MIN_SELL = 100;

interface Props extends Omit<ModalProps, 'children'> {
  type: 'buy' | 'sell';
}

export function RampModal({ type, ...props }: Props) {

  // TODO rfr for referrel code https://developers.mtpelerin.com/service-information/revenue-sharing
      
  // TODO refactor this mess

  const { wallet, ethBalance } = useAppContext();
  const mode = useColorModeValue('light', 'dark');
  const themeColor = useColorModeValue('%233182ce', '%2363b3ed');
  const tab = type === 'buy' ? 'buy' : 'sell';
  const addr = wallet?.address;
  const code = Math.floor(Math.random() * 9000) + 1000; // number between 1000 - 9999
  const encodedHash = encodeURIComponent(Buffer.from(wallet?.signMessageSync('MtPelerin-' + code) || ''.replace('0x', ''), 'hex').toString('base64'));
  
  // buy tab
  const bsc = 'EUR'; // buy tab default currency
  const bsa = '50'; // default fiat purchase amount

  // sell tab
  const sdc = 'EUR'; // sell tab default currency
  const ssa = Number(ethBalance) - 0.01; // default crypto sell amount

  // both tabs
  // from CHF, DKK, EUR, GBP, HKD, JPY, NOK, NZD, SEK, SGD, USD, ZAR
  const curs = 'EUR,USD'; // list of allowed fiat currencies

  const src = `https://widget.mtpelerin.com/?lang=en&mode=${mode}&primary=${themeColor}&success=${themeColor}&tabs=${tab}&tab=${tab}&net=xdai_mainnet&nets=xdai_mainnet&bsc=${bsc}&bdc=XDAI&bsa=${bsa}&curs=${curs}&crys=XDAI&dnet=xdai_mainnet&ssc=XDAI&sdc=${sdc}&ssa=${ssa}&snet=xdai_mainnet&addr=${addr}&chain=xdai_mainnet&code=${code}&hash=${encodedHash}`;
  
  return (
    <FullscreenModal 
      title={type === 'buy' ? 'Deposit' : 'Withdraw'}
      {...props}>
      <Box h={CONTENT_HEIGHT}>    
        <iframe height="100%" width="100%" allow="usb; clipboard-write" loading="lazy" src={src} />
      </Box>
    </FullscreenModal>
  );
}