import * as React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { ConfirmModal } from '../base/ConfirmModal';
import { CacheExpiry, CacheKeys, getValue, setValue } from '../../../utils/cache';
import { useState } from 'react';
import { useAppToast } from '../../../utils/ui';

/**
 * Install prompt implementation based on:
 * 
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt
 * 
 * Adds event listeners and Chakra prompt to give the user the option to install
 * the app on their mobile device.
 */
let installPrompt: any;

const promptShown: boolean = getValue(CacheKeys.INSTALL_PROMPT_SHOWN);
if (!promptShown) {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
  });
}

export function InstallPromptModal() {
  const [show, setShow] = useState<boolean>(!getValue(CacheKeys.INSTALL_PROMPT_SHOWN));
  const toast = useAppToast();

  const disablePrompt = () => {
    installPrompt = null;
    setValue(CacheKeys.INSTALL_PROMPT_SHOWN, true, CacheExpiry.NEVER);
    setShow(false);
  };

  const installClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
    } else {
      toast('Whoops, already installed!');
    }
    disablePrompt();
  };

  return (
    <Box id='installModal'>
      <ConfirmModal
        shown={show} 
        title="Install Lua Wallet"
        modalBody={
          <Flex flexDirection='column' gap='0.5rem'>
            <Text>For the best experience, you can install Lua as an app directly to your device.</Text>
            <Text>You can also do so later on via your browser&apos;s settings.</Text>
          </Flex>
        }
        confirmText={'Install'} 
        onCancelClick={disablePrompt}
        onConfirmClick={installClick}/>
    </Box>
  );
}