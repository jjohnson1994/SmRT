# SMRT

SMRT is a **SM**all library from building **R**eactive web **T**emplates.

### Monitoring State with Getters and Setters

SMRT uses getters and setters to track state updated, and update the DOM when needed.

In your application, the state might look something like this:
``` javascript
const state = {
  userName: 'jjohnson94',
};
```

SMRT will take this state and replace any values with getters and setters. This way we know when a value has been accessed, and when a values has been updated.
