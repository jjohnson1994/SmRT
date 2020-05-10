export const div = ({ children }) => ({
  tag: 'div',
  children,
});

export const button = ({ innerHTML, click }) => ({
  tag: 'button',
  innerHTML,
  events: { click },
});

export const h1 = (innerHTML) => ({
  tag: 'h1',
  innerHTML,
});

export const checkbox = ({ checked, onChange }) => ({
  tag: 'input',
  attrs: {
    type: 'checkbox',
    ...(checked() === true && { checked: 'checked' }),
  },
  events: {
    change: onChange,
  },
});

export const span = (innerHTML) => ({
  tag: 'span',
  innerHTML,
});
