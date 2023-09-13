import * as React from 'react';
import { BoxProps } from '@chakra-ui/react';
import { FileSelector } from './FileSelector';
import { useSetUserValue } from '../utils/users';
import { useCallback } from 'react';
import useIPFSClient from '../utils/useIFPSClient';
import { useAppContext } from '../AppProvider';
import { useAppToast } from '../utils/ui';
import { workableEth } from '../utils/eth';

export function AvatarImageUploader({children, ...props}: BoxProps) {
  const set = useSetAvatarImage();
  return (
    <FileSelector
      type='image'
      onFileSelected={(file) => {
        if (file) set(file);
      }} 
      {...props}>
      {children}
    </FileSelector>
  );
}

function useSetAvatarImage() {
  const { ethBalance, setProgressMessage } = useAppContext();
  const toast = useAppToast();

  const setAvatar = useSetUserValue('avatar_img');
  const client = useIPFSClient();
    
  const setAvatarImage = useCallback((file: File) => {

    const updateValue = async () => {

      if (workableEth(ethBalance) == 0) {
        toast('Requires user balance.');
        return;
      }

      setProgressMessage('Updating profile image...');
      
      const { Hash } = await client.add(file);

      await setAvatar(`https://ipfs.io/ipfs/${Hash}/`);
      
      toast('Image updated!');
      setProgressMessage(undefined);
    };
    
    updateValue().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });

  }, [client, ethBalance, setAvatar, setProgressMessage, toast]);
    
  return setAvatarImage;
}