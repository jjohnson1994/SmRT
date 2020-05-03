function createReactiveState(initialState) {
  return Object.entries(initialState).reduce((reactiveState, [key, value]) => {
    const newReactiveState = reactiveState;

    newReactiveState[`_${key}`] = value;

    Object.defineProperty(reactiveState, key, {
      get() {
        return reactiveState[`_${key}`];
      },
      set(newValue) {
        console.log(`setting ${key}`, newValue);
        newReactiveState[`_${key}`] = newValue;
      },
    });

    return newReactiveState;
  }, {});
}

function actualiseComponent(componentDescription, parentNode, state) {
  if (Array.isArray(componentDescription)) {
    componentDescription.forEach((child) => {
      actualiseComponent(child, parentNode, state);
    });
  }

  const {
    tag, innerHTML, children, events, attrs,
  } = typeof componentDescription === 'function'
    ? componentDescription({ state })
    : componentDescription;

  const newElement = document.createElement(tag);
  parentNode.appendChild(newElement);

  if (innerHTML) {
    newElement.innerHTML = innerHTML;
  }

  if (events) {
    Object.entries(events).forEach(([event, callback]) => {
      newElement.addEventListener(event, callback);
    });
  }

  if (attrs) {
    Object.entries(attrs).forEach(([attr, value]) => {
      newElement.setAttribute(attr, value);
    });
  }

  if (children) {
    actualiseComponent(children, newElement, state);
  }
}

function FRAMEWORK(_state) {
  const state = createReactiveState(_state);

  return {
    init: (main, parentNode) => {
      actualiseComponent(main, parentNode, state);
    },
  };
}

export default FRAMEWORK;
