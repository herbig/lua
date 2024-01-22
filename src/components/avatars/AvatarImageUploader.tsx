import * as React from 'react';
import { BoxProps } from '@chakra-ui/react';
import { FileSelector } from '../base/FileSelector';
import { useSetUserValue } from '../../utils/contracts/usernames';
import { useCallback } from 'react';
import useIPFSClient from '../../utils/ipfs';
import { useUser } from '../../providers/UserProvider';
import { useAppToast } from '../../utils/ui';
import { workableEth } from '../../utils/eth';
import { useUI } from '../../providers/UIProvider';

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
  const { ethBalance } = useUser();
  const { setProgressMessage } = useUI();
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

      await setAvatar(Hash);
      
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