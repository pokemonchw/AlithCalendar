import { Menu } from './Menu';
import { thanks } from './thanks';

export class ThanksMenu extends Menu {
  public constructor(parent: Menu) {
    super('鸣谢列表', parent);
    for (const person of thanks) {
      this.addItem(person.name, person.link === undefined
        ? { small: true }
        : { small: true, button: true, link: person.link },
      );
    }
  }
}
