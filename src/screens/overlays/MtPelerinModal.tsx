import * as React from 'react';
import { Box, CircularProgress, ModalProps, useColorModeValue } from '@chakra-ui/react';
import { Buffer } from 'buffer';
import { FullscreenModal } from '../../components/modals/base/FullscreenModal';
import { useUser } from '../../providers/UserProvider';
import { workableEth } from '../../utils/eth';
import { useDefaultBg } from '../../utils/ui';
import { useEffect, useState } from 'react';

export const MIN_SELL = 100;

interface Props extends Omit<ModalProps, 'children'> {
  type: 'buy' | 'sell';
}

export function MtPelerinModal({ type, ...props }: Props) {

  // TODO rfr for referrel code https://developers.mtpelerin.com/service-information/revenue-sharing
      
  const { wallet, ethBalance } = useUser();
  const mode = useColorModeValue('light', 'dark');
  const themeColor = useColorModeValue('%233182ce', '%2363b3ed');
  const tab = type === 'buy' ? 'buy' : 'sell';
  const addr = wallet?.address;
  const code = Math.floor(Math.random() * 9000) + 1000; // number between 1000 - 9999
  
  const hash = wallet?.signMessageSync('MtPelerin-' + {code}).replace('0x', '');
  const urlEncodedHash = encodeURIComponent(Buffer.from(hash!, 'hex').toString('base64'));
  
  // buy tab
  const bsc = 'EUR'; // buy tab default currency
  const bsa = '50'; // default fiat purchase amount

  // sell tab
  const sdc = 'EUR'; // sell tab default currency
  const ssa = workableEth(ethBalance); // default crypto sell amount

  // both tabs
  // from CHF, DKK, EUR, GBP, HKD, JPY, NOK, NZD, SEK, SGD, USD, ZAR
  const curs = 'EUR,USD,GBP'; // list of allowed fiat currencies

  const src = `https://widget.mtpelerin.com/?lang=en&mode=${mode}&primary=${themeColor}&success=${themeColor}&tabs=${tab}&tab=${tab}&net=xdai_mainnet&nets=xdai_mainnet&bsc=${bsc}&bdc=XDAI&bsa=${bsa}&curs=${curs}&crys=XDAI&dnet=xdai_mainnet&ssc=XDAI&sdc=${sdc}&ssa=${ssa}&snet=xdai_mainnet&addr=${addr}&chain=xdai_mainnet&code=${code}&hash=${urlEncodedHash}`;
  
  const bg = useDefaultBg();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(()=>{
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <FullscreenModal title={type === 'buy' ? 'Deposit' : 'Withdraw'} {...props}>

      {isLoading && <CircularProgress mt='10rem' alignSelf='center' size='4rem' isIndeterminate />}
        
      <Box mt='-2.4rem' h='100%' hidden={isLoading}>
        <iframe height="100%" width="100%" allow="usb; ethereum; clipboard-write" loading="lazy" src={src} />
        <Box h='3.1rem' w='full' bg={bg} mt='-3rem' position='absolute' />
      </Box>
    </FullscreenModal>
  );
}