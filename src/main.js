export default () => {
  let codeAction = '';

  const readFunctionOrConst = (toRead) => (typeof toRead === 'function' ? toRead() : toRead);

  function makeStateReactive(state, depth = 0) {
    if (depth > 1) {
      return state;
    }

    return Object.entries(state).forEach(([key, value]) => {
      // TODO dupe on line
      if (Array.isArray(value)) {
        value.forEach((childValue) => {
          makeStateReactive(childValue);
        });
      } else if (typeof value === 'object') {
        Object.values(value).forEach((childValue) => {
          makeStateReactive(childValue);
        });
      }

      const newStateItem = {
        value,
        observers: [],
      };

      delete state[key];

      Object.defineProperty(state, key, {
        get() {
          if (codeAction) {
            newStateItem.observers.push(codeAction);
          }

          return newStateItem.value;
        },
        set(newValue) {
          newStateItem.value = newValue;

          if (Array.isArray(value)) {
            newStateItem.value.forEach((childValue) => {
              makeStateReactive(childValue);
            });
          } else if (typeof value === 'object') {
            Object.values(newStateItem.value).forEach((childValue) => {
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

  function actualiseComponent(component, parentNode) {
    const {
      tag, children, innerHTML, events, attrs, value,
    } = component;

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
        newElement.value = readFunctionOrConst(value);
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

    if (typeof children === 'function') {
      codeAction = () => {
        newElement.innerHTML = '';

        children().forEach((child) => {
          actualiseComponent(child, newElement);
        });
      };

      codeAction();
      codeAction = undefined;
    } if (Array.isArray(children)) {
      children.forEach((child) => {
        actualiseComponent(child, newElement);
      });
    }

    parentNode.appendChild(newElement);
  }

  function run(main, parent, states) {
    states.forEach((state) => makeStateReactive(state));
    actualiseComponent(main, parent);
  }

  return { run };
};
