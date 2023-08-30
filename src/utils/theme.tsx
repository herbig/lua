
import { useColorModeValue, useToast } from '@chakra-ui/react';

export function useDefaultBg(): string {
  return useColorModeValue('white', 'gray.800');
}

export function useAppToast() {
  const t = useToast({
    duration: 3000,
    isClosable: false
  });
  const toast = (message: string, isError?: boolean) => {
    t({
      description: message,
      status: isError ? 'error' : 'info'
    });
  };
  return toast;
}

export function elapsedDisplay(secondsStamp: number | string): string {

  const then = Number(secondsStamp) * 1000;
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const elapsed = new Date().getTime() - then;

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000);
    return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');   
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute);
    return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');   
  } else if (elapsed < msPerDay ) {
    const hours = Math.round(elapsed / msPerHour );
    return hours + (hours === 1 ? ' hour ago' : ' hours ago');   
  } else if (elapsed < msPerDay * 7) {
    const days = Math.round(elapsed/msPerDay);
    return days + (days === 1 ? ' day ago' : ' days ago');   
  } else {
    return new Date(then).toDateString();
  }
}