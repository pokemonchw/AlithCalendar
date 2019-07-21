const noop = () => { /* noop */ };
export class BooleanSetting {
  private value: boolean;
  public constructor(
    private key: string,
    defaultValue: boolean,
    private onUpdate: (newValue: boolean) => void = noop,
  ) {
    if (defaultValue) {
      this.value = window.localStorage.getItem(key) !== 'false';
    } else {
      this.value = window.localStorage.getItem(key) === 'true';
    }
    this.updateLocalStorage();
    this.onUpdate(this.value);
  }
  private updateLocalStorage() {
    window.localStorage.setItem(this.key, String(this.value));
  }
  public getValue() {
    return this.value;
  }
  public setValue(newValue: boolean) {
    if (newValue !== this.value) {
      this.onUpdate(newValue);
    }
    this.value = newValue;
    this.updateLocalStorage();
  }
  public toggle() {
    this.setValue(!this.value);
  }
}

export class EnumSetting {
  private value: number;
  public constructor(
    private key: string,
    public options: Array<string>,
    private defaultValue: number,
    private onUpdate: (newValue: number, newValueName: string) => void = noop,
  ) {
    if (!this.isCorrectValue(defaultValue)) {
      throw new Error(`Default value ${defaultValue} is not correct.`);
    }
    this.value = +(window.localStorage.getItem(key) || defaultValue);
    this.correctValue();
    this.onUpdate(this.value, this.options[this.value]);
  }
  private isCorrectValue(value: number): boolean {
    return !(Number.isNaN(value) || value % 1 !== 0 || value < 0 || value >= this.options.length);
  }
  private correctValue() {
    if (!this.isCorrectValue(this.value)) {
      this.value = this.defaultValue;
    }
  }
  private updateLocalStorage() {
    window.localStorage.setItem(this.key, String(this.value));
  }
  public getValue() {
    return this.value;
  }
  public getValueName() {
    return this.options[this.value];
  }
  public setValue(newValue: number) {
    if (newValue !== this.value) {
      this.onUpdate(newValue, this.options[newValue]);
    }
    this.value = newValue;
    this.updateLocalStorage();
  }
}

export const animation = new BooleanSetting('animation', true, value => {
  document.body.classList.toggle('animation-enabled', value);
});
export const warning = new BooleanSetting('warning', false);
export const earlyAccess = new BooleanSetting('earlyAccess', false, value => {
  document.body.classList.toggle('early-access-disabled', !value);
});
export const useComments = new BooleanSetting('useComments', true);
export const gestureSwitchChapter = new BooleanSetting('gestureSwitchChapter', true);
// https://github.com/zenozeng/fonts.css
const fontFamilyCssValues = [
  '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
  'Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, "TW\-Kai", serif',
  'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, "TW\-Sung", "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", PMingLiU, MingLiU, serif',
  'Baskerville, "Times New Roman", "Liberation Serif", STFangsong, FangSong, FangSong_GB2312, "CWTEX\-F", serif',
];
export const fontFamily = new EnumSetting('fontFamily', ['黑体', '楷体', '宋体', '仿宋'], 0, (fontFamilyIndex: number) => {
  document.documentElement.style.setProperty('--font-family', fontFamilyCssValues[fontFamilyIndex]);
});
export const debugLogging = new BooleanSetting('debugLogging', false);
export const charCount = new BooleanSetting('charCount', true, value => {
  document.body.classList.toggle('char-count-disabled', !value);
});
