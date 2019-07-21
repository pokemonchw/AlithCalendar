import { data } from './data';
import { Menu } from './Menu';

export class StatsKeywordsCountMenu extends Menu {
  public constructor(parent: Menu) {
    super('关键词统计', parent);
    this.addItem('添加其他关键词', {
      small: true,
      button: true,
      link: 'https://github.com/pokemonchw/AlithCalendar/edit/master/src/builder/keywords.ts',
    });
    data.keywordsCount.forEach(([keyword, count]) => {
      this.addItem(`${keyword}：${count}`, { small: true });
    });
  }
}
