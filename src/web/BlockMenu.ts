import { blockedUserUpdateEvent, getBlockedUsers, unblockUser } from './commentBlockControl';
import { Menu } from './Menu';
import { CLICK_TO_UNBLOCK, NO_BLOCKED_USERS } from './messages';

export class BlockMenu extends Menu {
  private update() {
    this.clearItems();
    const blockedUsers = getBlockedUsers();
    if (blockedUsers.length === 0) {
      this.addItem(NO_BLOCKED_USERS, { small: true });
    } else {
      this.addItem(CLICK_TO_UNBLOCK, { small: true });
    }
    blockedUsers.forEach(userName => {
      this.addItem(userName, { small: true, button: true })
        .onClick(() => {
          unblockUser(userName);
        });
    });
  }
  public constructor(parent: Menu) {
    super('屏蔽用户评论管理', parent);
    this.update();
    blockedUserUpdateEvent.on(this.update.bind(this));
  }
}
