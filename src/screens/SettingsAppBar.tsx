import * as React from 'react';
import {
  BoxProps,
  IconButton,
  Text
} from '@chakra-ui/react';
import { AppBarBase } from '../components/AppBarBase';
import { FaArrowLeft } from 'react-icons/fa';

interface Props extends BoxProps {
  onBackClicked: () => void;
}

export function SettingsAppBar({ onBackClicked, ...props }: Props) {
  return (
    <AppBarBase {...props}>
      <IconButton onClick={onBackClicked} ms="-1rem" variant="ghost" icon={<FaArrowLeft />} aria-label={''} />
      <Text as="b">Settings</Text>
    </AppBarBase>
  );
}