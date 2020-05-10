# SMRT

SMRT is a **SM**all library from building **R**eactive web **T**emplates.

## Getting Started

Add SMRT to your web page or app either as a package or as a script.

`npm install smrt` or `<script src="https://unpkg.com/smrt"></script`

## Example
```
import smrt from 'smrt';

const myApp = smrt();

cosnt helloWorldState = {
  userName: 'World',
};

const appTitle = {
  tag: 'h1',
  innerHTML: () => `Hello ${helloWorldState.userName} 👋`,
};

const userNameInput = {
  tag: 'input',
  value: () => helloWorldState.userName,
  events: {
    input: event => {
      helloWorldState.userName = event.target.value;
    },
  },
};

const helloWorldApp = {
  tag: 'div',
  children: [
    appTitle,
    userNameInput,
  ],
};

const parent = document.querySelected('#app');
myApp.run(helloWorldApp, parent, [myAppState]);
```
