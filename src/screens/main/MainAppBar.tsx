import * as React from 'react';
import {
  BoxProps,
  IconButton,
  Spacer,
  Text
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { AppBarBase } from '../../components/AppBarBase';

interface Props extends BoxProps {
  onIconClicked: () => void;
}

export function MainAppBar({ onIconClicked, ...rest }: Props) {
  return (
    <AppBarBase {...rest}>
      <Text as="b">Lua</Text>
      <Spacer />
      <IconButton me="-1rem" onClick={onIconClicked} variant="ghost" icon={<FaUser />} aria-label={''} />
    </AppBarBase>
  );
}