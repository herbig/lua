import { CHAIN_ID } from '../constants';

interface IStorageValue {
    // the value to store, 1 character to minimize cache size
    v: any;
    // the expiration, as a UTC timestamp
    e: number;
  }
  
/**
 * Useful defaults for cache expiration minutes.
 */
export enum CacheExpiry {
    NEVER = -1,
    ONE_HOUR = 60,
    ONE_DAY = ONE_HOUR * 24,
    ONE_WEEK = ONE_DAY * 7,
}
  
/**
 * The list of cache keys used in the app.
 *
 * To avoid weird bugs due to duplicate keys,
 * hardcoding keys should be avoided, always 
 * add the cache key here.
 */
export enum CacheKeys {
    USERNAME_TO_ADDRESS = 'u2a',
    ADDRESS_TO_USERNAME = 'a2u'
}
  
interface IndexedObject {
  [key: string]: any;
}
  
/**
 * Cache default values.
 *
 * Cache keys are not required to have a default value.
 */
export const CACHE_DEFAULTS: IndexedObject = {
  // [CacheKeys.EXAMPLE.toString()]: Array<string>(),
};

function keyInternal(key: string): string {
  return CHAIN_ID + key;
}

/**
 * Sets a cached value.
 * 
 * The default expiration is 1 week. Use CacheExpiry.NEVER to keep
 * the value cached indefinitely.
 *
 * All JSON parsing is done internally, you should only need to pass
 * the value, array, or object you would like to cache.
 */
export const setValue = (
  key: string,
  value: any,
  expirationMinutes: number = CacheExpiry.ONE_WEEK
): void => {
  if (typeof window !== 'undefined') {
    const val: IStorageValue = {
      v: value,
      e:
        expirationMinutes === CacheExpiry.NEVER
          ? CacheExpiry.NEVER
          : Date.now() + expirationMinutes * 60000
    };
    localStorage.setItem(keyInternal(key), JSON.stringify(val));
  }
};

/**
 * Gets a cached value, or its default if none is cached.
 */
export const getValue = (key: string): any => {
  const rawVal = localStorage.getItem(keyInternal(key));
  if (rawVal) {
    const parsed: IStorageValue = JSON.parse(rawVal);
    if (parsed.e === CacheExpiry.NEVER) {
      return parsed.v;
    } else {
      if (parsed.e < Date.now()) {
        localStorage.removeItem(keyInternal(key));
        return undefined;
      } else {
        return parsed.v;
      }
    }
  } else if (CACHE_DEFAULTS[key]) {
    return CACHE_DEFAULTS[key];
  } else {
    return undefined;
  }
};
