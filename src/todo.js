import FRAMEWORK from './main';

const appState = {
  todos: [
    {
      id: 0,
      title: 'think of a decent name',
      done: false,
    },
    {
      id: 1,
      title: 'write cool framework',
      done: false,
    },
    {
      id: 2,
      title: 'eat dinner',
      done: true,
    },
  ],
};

const todoApp = FRAMEWORK(appState);

const div = (description) => ({
  tag: 'div',
  ...description,
});

const tag = (tag, description) => ({
  tag,
  ...description,
});

const todoListItem = ({ id, title, done }) => ({ state }) => ({
  tag: 'li',
  children: [
    {
      tag: 'input',
      attrs: {
        type: 'checkbox',
        ...(done && { checked: '' }),
      },
    },
    {
      tag: 'label',
      innerHTML: title,
    },
  ],
  events: {
    mousedown: () => {
      const newTodos = [...state.todos];
      newTodos.find((todo) => todo.id === id).done = !done;

      state.todos = newTodos;
    },
  },
});

const todoList = ({ state }) => tag('ul', {
  children: state.todos.map((todo) => todoListItem(todo)),
});

const title = {
  tag: 'h1',
  innerHTML: 'Todo',
};

const description = {
  tag: 'p',
  innerHTML: 'Simple todo list app built with FRAMEWORK',
};

const newToDoForm = [
  {
    tag: 'input',
    attrs: {
      placeholder: 'New Todo',
    },
  },
  {
    tag: 'button',
    innerHTML: 'Submit',
  },
];

const main = [
  div({ children: [title, description] }),
  newToDoForm,
  div({ children: [todoList] }),
];

todoApp.init(main, document.querySelector('#app'));
