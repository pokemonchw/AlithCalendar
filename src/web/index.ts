import { data } from './data';
import { id } from './DOM';
import { followQuery } from './followQuery';
import { MainMenu } from './MainMenu';
import { animation } from './settings';
import { updateSelection } from './updateSelection';

const $warning = id('warning');

if ($warning !== null) {
  $warning.addEventListener('click', () => {
    $warning.style.opacity = '0';
    if (animation.getValue()) {
      $warning.addEventListener('transitionend', () => {
        $warning.remove();
      });
    } else {
      $warning.remove();
    }
  });
}

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
