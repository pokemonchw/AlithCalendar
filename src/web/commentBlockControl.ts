import { Event } from './Event';

const blockedUsers = new Set<string>(JSON.parse(window.localStorage.getItem('blockedUsers') || '[]'));

export const blockedUserUpdateEvent = new Event();

function saveBlockedUsers() {
  window.localStorage.setItem('blockedUsers', JSON.stringify(Array.from(blockedUsers)));
  blockedUserUpdateEvent.emit();
}

export function blockUser(userName: string) {
  blockedUsers.add(userName);
  saveBlockedUsers();
}

export function unblockUser(userName: string) {
  blockedUsers.delete(userName);
  saveBlockedUsers();
}

export function isUserBlocked(userName: string) {
  return blockedUsers.has(userName);
}

export function getBlockedUsers() {
  return Array.from(blockedUsers);
}
