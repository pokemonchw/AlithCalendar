import { BlockMenu } from './BlockMenu';
import { hideComments } from './commentsControl';
import { id } from './DOM';
import { ItemDecoration, ItemHandle, Menu } from './Menu';
import { RectMode } from './RectMode';
import { animation, BooleanSetting, charCount, debugLogging, earlyAccess, EnumSetting, fontFamily, gestureSwitchChapter, useComments, warning } from './settings';
import { stylePreviewArticle } from './stylePreviewArticle';

export class EnumSettingMenu extends Menu {
  public constructor(parent: Menu, label: string, setting: EnumSetting, usePreview: boolean) {
    super(`${label}设置`, parent, usePreview ? RectMode.SIDE : RectMode.MAIN);
    let currentHandle: ItemHandle;
    if (usePreview) {
      this.activateEvent.on(() => {
        hideComments();
        id('content').innerHTML = stylePreviewArticle;
      });
    }
    setting.options.forEach((valueName, value) => {
      const handle = this.addItem(valueName, { small: true, button: true, decoration: ItemDecoration.SELECTABLE })
        .onClick(() => {
          currentHandle.setSelected(false);
          handle.setSelected(true);
          setting.setValue(value);
          currentHandle = handle;
        });
      if (value === setting.getValue()) {
        currentHandle = handle;
        handle.setSelected(true);
      }
    });
  }
}

export class SettingsMenu extends Menu {
  public constructor(parent: Menu) {
    super('设置', parent);
    this.addBooleanSetting('使用动画', animation);
    this.addBooleanSetting('显示编写中章节', earlyAccess);
    this.addBooleanSetting('显示评论', useComments);
    this.addBooleanSetting('手势切换章节（仅限手机）', gestureSwitchChapter);
    this.addEnumSetting('字体', fontFamily, true);
    this.addBooleanSetting('显示每个章节的字数', charCount);
    this.addBooleanSetting('开发人员模式', debugLogging);
    this.addLink(new BlockMenu(this), true);
  }
  public addBooleanSetting(label: string, setting: BooleanSetting) {
    const getText = () => `${label}：${setting.getValue() ? '开' : '关'}`;
    const handle = this.addItem(getText(), { small: true, button: true })
      .onClick(() => {
        setting.toggle();
        handle.setInnerText(getText());
      });
  }
  public addEnumSetting(label: string, setting: EnumSetting, usePreview?: true) {
    const getText = () => `${label}：${setting.getValueName()}`;
    const handle = this.addItem(getText(), { small: true, button: true });
    const enumSettingMenu = new EnumSettingMenu(this, label, setting, usePreview === true);
    handle.linkTo(enumSettingMenu).onClick(() => {
      this.activateEvent.once(() => {
        handle.setInnerText(getText());
      });
    });
  }
}
