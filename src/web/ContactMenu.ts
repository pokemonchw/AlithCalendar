import { Menu } from './Menu';

export class ContactMenu extends Menu {
  public constructor(parent: Menu) {
    super('订阅/讨论组', parent);
    this.addItem('GitHub Repo', {
      small: true,
      button: true,
      link: 'https://github.com/pokemonchw/AlithCalendar',
    });
    this.addItem('作者Mastodon', {
      small: true,
      button: true,
      link: 'https://pawoo.net/@nekoharuya',
    });
  }
}
