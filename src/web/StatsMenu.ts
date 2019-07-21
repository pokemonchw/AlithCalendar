import { data } from './data';
import { Menu } from './Menu';
import { StatsKeywordsCountMenu } from './StatsKeywordsCountMenu';

export class StatsMenu extends Menu {
  public constructor(parent: Menu) {
    super('统计', parent);
    this.addItem('统计数据由构建脚本自动生成', { small: true });
    this.addLink(new StatsKeywordsCountMenu(this), true);
    this.addItem(`总字数：${data.charsCount}`, { small: true });
    this.addItem(`总段落数：${data.paragraphsCount}`, { small: true });
  }
}
