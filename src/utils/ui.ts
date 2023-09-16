
import { useColorModeValue, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

export function useDefaultBg(): string {
  return useColorModeValue('white', 'gray.800');
}

export function useTextRed(): string {
  return useColorModeValue('red.500', 'red.600');
}

export function useTextGreen(): string {
  return useColorModeValue('green.600', 'green.500');
}

export function useButtonBlue(): string {
  return useColorModeValue('blue.600', 'blue.200');
}

export function useButtonHoverBlue(): string {
  return useColorModeValue('blue.700', 'blue.300');
}

export function useButtonPressedBlue(): string {
  return useColorModeValue('blue.800', 'blue.400');
}

export function useAppToast() {
  const t = useToast({
    duration: 3000,
    isClosable: false,
    containerStyle: { mb: '3rem' }
  });
  const toast = (message: string, id?: string) => {
    if (!id || !t.isActive(id)) {
      t({
        description: message,
        status: 'info',
        id: id
      });
    }
  };
  return toast;
}

// TODO refactor and clean up this nonsense
export function elapsedDisplay(secondsStamp: number | string, style: 'short' | 'long'): string {

  const thenMs = Number(secondsStamp) * 1000;
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const now = new Date();
  const elapsed = now.getTime() - thenMs;

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000);
    if (style === 'short') return seconds + 's';
    return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');   
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute);
    if (style === 'short') return minutes + 'm';
    return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');   
  } else if (elapsed < msPerDay ) {
    const hours = Math.round(elapsed / msPerHour );
    if (style === 'short') return hours + 'h';
    return hours + (hours === 1 ? ' hour ago' : ' hours ago');   
  } else if (elapsed < msPerDay * 7) {
    const days = Math.round(elapsed/msPerDay);
    if (style === 'short') return days + 'd';
    return days + (days === 1 ? ' day ago' : ' days ago');   
  } else {
    const then = new Date(thenMs);
    if (style === 'short') {
      return then.toLocaleDateString();
    } else {
      const month = then.toLocaleString('default', { month: 'short' });
      return 'On ' + month + ' ' + then.getDay() 
        + (then.getFullYear() === now.getFullYear() ? '' : ', ' + then.getFullYear());
    }
  }
}

// adding state history to allow for hijacking the
// Android back button.  See useBackButton below.
window.onload = () => {
  window.history.pushState({}, '');
};

export function useBackButton(isOpen: boolean, onBack: () => void) {
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('popstate', () => {
        window.history.pushState({}, '');
        onBack();
      }, { once: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}