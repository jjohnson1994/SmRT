import SMRT from './main';

const myApp = SMRT();

/**
 * Common Components
 */
const div = ({ children }) => ({
  tag: 'div',
  children,
});

const button = ({ innerHTML, click }) => ({
  tag: 'button',
  innerHTML,
  events: { click },
});

const h1 = (innerHTML) => ({
  tag: 'h1',
  innerHTML,
});

const checkbox = ({ checked, onChange }) => ({
  tag: 'input',
  attrs: {
    type: 'checkbox',
    ...(checked() === true && { checked: 'checked' }),
  },
  events: {
    change: onChange,
  },
});

const span = (innerHTML) => ({
  tag: 'span',
  innerHTML,
});

/**
  * Counter app
  */
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

/**
  * Todo App
  *
  */
const todoState = {
  newTodoTitle: '',
  todos: [{ id: 0, title: 'Write something cool', done: true }],
};

const edtNewTodo = ({
  tag: 'input',
  value: () => todoState.newTodoTitle,
  attrs: {
    type: 'text',
    placeholder: 'New Todo',
  },
  events: {
    input: (event) => {
      todoState.newTodoTitle = event.target.value;
    },
  },
});

const btnSaveNewTodo = button({
  innerHTML: 'Save',
  click: () => {
    const newTodos = todoState.todos.concat({
      title: todoState.newTodoTitle,
      done: false,
    });

    todoState.todos = newTodos;
    todoState.newTodoTitle = '';
  },
});

const todoOnClick = (event, todo, index) => {
  todoState.todos[index].done = !todo.done;
};

const todoListItem = (todo, index) => ({
  tag: 'li',
  children: () => ([
    {
      tag: 'label',
      children: () => ([
        checkbox({
          checked: () => todo.done,
          onChange: (event) => todoOnClick(event, todo, index),
        }),
        span(() => todo.title),
      ]),
    },
  ]),
});

const todosList = div({
  children: [
    {
      tag: 'ul',
      children: () => todoState.todos.map((todo, index) => todoListItem(todo, index)),
    },
  ],
});

const todoApp = div({
  children: [
    h1('Todos'),
    edtNewTodo,
    btnSaveNewTodo,
    todosList,
  ],
});

const appMain = div({
  children: [
    counterApp,
    todoApp,
  ],
});


const parent = document.querySelector('#app');
myApp.run(appMain, parent, [counterState, todoState]);
