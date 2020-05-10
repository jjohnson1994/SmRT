### State with Getters and Setters

SMRT uses getters and setters to track state updated, and update the DOM when needed.

In your application, the state might look something like this:
``` javascript
const state = {
  userName: 'spacerangerjim',
  latestScores: [20, 29, 30, 19],
};
```

FRAMEWORK will take this state and turn into the following object:
```javascript
const state = {
  _userName: {
    value: 'spacerangerjim',
    observers: [],
  },
  _latestScores: [
    {
      value: 20,
      observers: [],
      get value() {
        observers.push(currentCodeAction);
        return value;
      },
      set value(newValue) {
        value = newValue;
      },
    },
    // ...
  ],
  get userName() {
    _userName.observers.push(currentCodeAction);
    return _userName.value;
  },
  set userName(newValue) {
    _userName.value = newValue;
  },
  get latestScores() {
    _latestScores.observers.push(currentCodeAction);
    return latestScores;
  },
  set latestScores(newValue) {
    _latestScores.value = makeArrayChildrenReactive(newValue);
  },
};
```

Notice that whenever a Getter is accessed, the `currentCodeAction` is pushed into the `observers` array. This means actions like updating innerHTML can be re-run when state items are updated.
