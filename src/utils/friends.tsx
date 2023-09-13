import { CacheKeys, getValue, setValue } from './cache';

interface Friend {
    address: string;
    weight: number;
}

const friends: Array<Friend> = getValue(CacheKeys.FRIENDS);
  
export function getFriends(): Array<Friend> {
  return friends;
}
  
export function addFriendWeight(address: string) {
  // TODO probably need to have a max friends length
  const l = friends.length;
  let found = false;
  for (let i = 0; i < l; i++) {
    const friend = friends[i];
    // TODO this should use a map or something, finding and
    // sorting here seems pretty inefficient
    if (friend.address === address) {
      friends[i].weight++;
      friends.sort((a, b) => b.weight - a.weight);
      setValue(CacheKeys.FRIENDS, friends);
      found = true;
      break;
    }
  }
  if (!found) {
    friends.push({
      address: address,
      weight: 1
    });
    setValue(CacheKeys.FRIENDS, friends);
  }
}