export interface IComponent {
  tag: string;
  attrs?: object;
  children?: IComponent[];
  events?: object;
  innerHTML?: string | (() => string | number);
  value?: string | number;
}

interface ISMRT {
  run: (main: IComponent, parent: HTMLElement, states: object[]) => void;
}

interface IStateItem {
  value: any;
  observers: (() => void)[];
}

function SMRT(): ISMRT {
  let codeAction: (() => void) | undefined;

  function readFunctionOrConst(toRead: any) {
    return typeof toRead === "function" ? toRead() : toRead;
  }

  function makeStateReactive(state: object, depth = 0) {
    if (depth > 1) {
      return state;
    }

    return Object.entries(state).forEach(([key, value]) => {
      // TODO dupe on line 48
      if (Array.isArray(value)) {
        value.forEach((childValue) => {
          makeStateReactive(childValue);
        });
      } else if (typeof value === "object") {
        Object.values(value).forEach((childValue: any) => {
          makeStateReactive(childValue);
        });
      }

      const newStateItem: IStateItem = {
        value,
        observers: [],
      };

      // eslint-disable-next-line no-param-reassign
      delete state[key];

      Object.defineProperty(state, key, {
        get() {
          if (codeAction !== undefined) {
            newStateItem.observers.push(codeAction);
          }

          return newStateItem.value;
        },
        set(newValue) {
          newStateItem.value = newValue;

          // TODO dupe on line 19
          if (Array.isArray(value)) {
            newStateItem.value.forEach((childValue: any) => {
              makeStateReactive(childValue);
            });
          } else if (typeof value === "object") {
            Object.values(newStateItem.value).forEach((childValue: any) => {
              makeStateReactive(childValue);
            });
          }

          newStateItem.observers.forEach((observer) => {
            observer();
          });
        },
      });
    });
  }

  function actualiseComponent(component: IComponent, parentNode: HTMLElement) {
    const { tag, children, innerHTML, events, attrs, value } = component;

    const newElement = document.createElement(tag);

    if (innerHTML !== undefined) {
      codeAction = () => {
        newElement.innerHTML = readFunctionOrConst(innerHTML);
      };

      codeAction();
      codeAction = undefined;
    }

    if (value) {
      codeAction = () => {
        (newElement as HTMLInputElement).value = readFunctionOrConst(value);
      };

      codeAction();
      codeAction = undefined;
    }

    if (events) {
      Object.entries(events).forEach(([type, callback]) => {
        newElement.addEventListener(type, callback);
      });
    }

    if (attrs) {
      Object.entries(attrs).forEach(([attr, value]) => {
        codeAction = () => {
          newElement.setAttribute(attr, readFunctionOrConst(value));
        };

        codeAction();
        codeAction = undefined;
      });
    }

    if (typeof children === "function") {
      codeAction = () => {
        newElement.innerHTML = "";

        children().forEach((child) => {
          actualiseComponent(child, newElement);
        });
      };

      codeAction();
      codeAction = undefined;
    }
    if (Array.isArray(children)) {
      children.forEach((child) => {
        actualiseComponent(child, newElement);
      });
    }

    parentNode.appendChild(newElement);
  }

  function run(main: IComponent, parent: HTMLElement, states: object[]) {
    states.forEach((state) => makeStateReactive(state));
    actualiseComponent(main, parent);
  }

  return { run };
}

export default SMRT;
