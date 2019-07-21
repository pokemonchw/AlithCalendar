import { ChaptersMenu } from './ChaptersMenu';
import { ContactMenu } from './ContactMenu';
import { Menu } from './Menu';
import { SettingsMenu } from './SettingsMenu';
import { StatsMenu } from './StatsMenu';
import { StyleMenu } from './StyleMenu';
import { ThanksMenu } from './ThanksMenu';

export class MainMenu extends Menu {
  public constructor() {
    super('', null);
    this.addLink(new ChaptersMenu(this));
    this.addLink(new ThanksMenu(this));
    this.addLink(new StyleMenu(this));
    this.addLink(new ContactMenu(this));
    this.addItem('源代码', { button: true, link: 'https://github.com/pokemonchw/AlithCalendar' });
    this.addLink(new SettingsMenu(this));
    this.addLink(new StatsMenu(this));
  }
}
