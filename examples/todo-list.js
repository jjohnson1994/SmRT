import SMRT from '../src/main';
import { div, button, checkbox, h1, span } from './common-elements';

const myApp = SMRT();

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

const parent = document.querySelector('#todoContainer');
myApp.run(todoApp, parent, [todoState]);
