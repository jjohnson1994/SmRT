import SMRT from '../src/main';
import { div, h1, button } from './common-elements';

const myApp = SMRT();

const counterState = {
  count: 0,
};

const lblCount = ({
  tag: 'p',
  innerHTML: () => counterState.count,
});

const counterApp = div({
  children: [
    h1('Counter'),
    lblCount,
    button({
      innerHTML: 'Add',
      click: () => {
        counterState.count += 1;
      },
    }),
    button({
      innerHTML: 'Subtract',
      click: () => {
        counterState.count -= 1;
      },
    }),
  ],
});

const parent = document.querySelector('#counterContainer');
myApp.run(counterApp, parent, [counterState]);
