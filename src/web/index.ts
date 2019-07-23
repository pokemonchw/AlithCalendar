import { data } from './data';
import { id } from './DOM';
import { followQuery } from './followQuery';
import { MainMenu } from './MainMenu';
import { updateSelection } from './updateSelection';

const $warning = id('warning');

const $buildNumber = id('build-number');
$buildNumber.innerText = `Build ${data.buildNumber}`;

new MainMenu().setActive(true);

document.addEventListener('selectionchange', () => {
  updateSelection();
});

window.addEventListener('popstate', () => {
  followQuery();
});

followQuery();
