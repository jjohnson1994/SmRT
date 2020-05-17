import SMRT, { IComponent } from "../src/main";

const div = ({ children }: { children: IComponent[] }): IComponent => ({
  tag: "div",
  children,
});

const h1 = (innerHTML: string): IComponent => ({
  tag: "h1",
  innerHTML,
});

const button = ({
  innerHTML,
  click,
}: {
  innerHTML: string;
  click: () => void;
}): IComponent => ({
  tag: "button",
  innerHTML,
  events: { click },
});

const myApp = SMRT();

const counterState = {
  count: 0,
};

const lblCount = {
  tag: "p",
  innerHTML: () => counterState.count,
};

const counterApp = div({
  children: [
    h1("Counter"),
    lblCount,
    button({
      innerHTML: "Add",
      click: () => {
        counterState.count += 1;
      },
    }),
    button({
      innerHTML: "Subtract",
      click: () => {
        counterState.count -= 1;
      },
    }),
  ],
});

const parent: HTMLElement | null = document.querySelector("#counterContainer");

if (parent !== null) {
  myApp.run(counterApp, parent, [counterState]);
}
