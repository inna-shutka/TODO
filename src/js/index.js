import {getOrFetchTodo, removeCacheTodo, editCacheTodo, saveToCache, getCacheData} from './cashe';

"use strict";

export const CACHE_KEY = 'todos';
const LIST_ID = 'todo-list';
const $inputAdd = document.querySelector('[name="todo"]');
const $btnAdd = document.getElementById('new-task-submit');

export async function getTodo() {
    const result = await fetch('https://jsonplaceholder.typicode.com/todos');
    return result.json();
}

function getListItem({ id, title, completed }) {

    const $task = document.createElement('li');
    const $taskContent = document.createElement('div');
    const $taskContentText = document.createElement('p');
    const $action = document.createElement('span');
    const $toggleLabel = document.createElement('label');
    const $toggleInput = document.createElement('input');
    const $toggleButton = document.createElement('span');
    const $delete = document.createElement('button');

    $taskContentText.setAttribute('type', 'text');
    $taskContentText.setAttribute('readonly', '');

    $taskContentText.innerText = title;
    $toggleInput.setAttribute('type', 'checkbox');
    $toggleInput.checked = completed;

    $task.classList.add('task');
    $taskContent.classList.add('task__content');
    $taskContentText.classList.add('task__content-text');
    $action.classList.add('task__actions');
    $toggleLabel.classList.add('checkbox');
    $toggleInput.classList.add('checkbox__input');
    $toggleButton.classList.add('checkbox__button');
    $delete.classList.add('delete');

    $taskContent.append($taskContentText);
    $toggleLabel.append($toggleInput, $toggleButton);
    $action.append($toggleLabel, $delete);
    $task.append($taskContent, $action);

    $task.dataset.id = id;
    $taskContentText.innerText = title;

    $toggleButton.innerHTML = `
    <svg class="checkbox__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"/>
    </svg>
    `;
    $delete.innerHTML = `
    <svg class="delete__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_220_174)">
        <path d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.196 20.021 5 19.55 5 19V6C4.71667 6 4.479 5.90433 4.287 5.713C4.09567 5.521 4 5.28333 4 5C4 4.71667 4.09567 4.479 4.287 4.287C4.479 4.09567 4.71667 4 5 4H9C9 3.71667 9.096 3.479 9.288 3.287C9.47933 3.09567 9.71667 3 10 3H14C14.2833 3 14.521 3.09567 14.713 3.287C14.9043 3.479 15 3.71667 15 4H19C19.2833 4 19.5207 4.09567 19.712 4.287C19.904 4.479 20 4.71667 20 5C20 5.28333 19.904 5.521 19.712 5.713C19.5207 5.90433 19.2833 6 19 6V19C19 19.55 18.8043 20.021 18.413 20.413C18.021 20.8043 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.096 16.5207 9.288 16.712C9.47933 16.904 9.71667 17 10 17C10.2833 17 10.521 16.904 10.713 16.712C10.9043 16.5207 11 16.2833 11 16V9C11 8.71667 10.9043 8.479 10.713 8.287C10.521 8.09567 10.2833 8 10 8C9.71667 8 9.47933 8.09567 9.288 8.287C9.096 8.479 9 8.71667 9 9V16ZM13 16C13 16.2833 13.096 16.5207 13.288 16.712C13.4793 16.904 13.7167 17 14 17C14.2833 17 14.521 16.904 14.713 16.712C14.9043 16.5207 15 16.2833 15 16V9C15 8.71667 14.9043 8.479 14.713 8.287C14.521 8.09567 14.2833 8 14 8C13.7167 8 13.4793 8.09567 13.288 8.287C13.096 8.479 13 8.71667 13 9V16Z"/>
        </g>
        <defs>
        <clipPath id="clip0_220_174">
        <rect width="24" height="24"/>
        </clipPath>
        </defs>
    </svg>
    `;

    toggleChange($task, completed);

    $toggleInput.addEventListener('change', (e) => {
        const { checked } = e.target;
        editCacheTodo(id, { completed: checked });
        toggleChange($task, checked);
    });

    $delete.addEventListener('mouseover', () => {
        $task.style.backgroundColor = '#F2F3FD';
        $taskContentText.style.textDecoration= 'line-through';
        $taskContentText.style.opacity = 0.5;
    });
    $delete.addEventListener('mouseout', () => {
        $task.style.backgroundColor = null;
        $taskContentText.style.textDecoration = 'none';
        $taskContentText.style.opacity = 1;
    });

    $delete.addEventListener('click', () => {
        const $popup = document.getElementById('popup');
        const $popupClose = document.querySelector('.popup__close');
        const $popupBtnNo = document.querySelector('.popup__button--no');
        const $popupBtnYes = document.querySelector('.popup__button--yes');
        $popup.classList.add('popup-active');

        $popupClose.addEventListener('click', () => {
            $popup.classList.remove('popup-active');
        });
        $popupBtnNo.addEventListener('click', () => {
            $popup.classList.remove('popup-active');
        });

        $popupBtnYes.addEventListener('click', () => {
            $task.classList.add('task__delete');
            $task.addEventListener('transitionend', () => {
                removeCacheTodo(id);
                $popup.classList.remove('popup-active');
                $task.remove();
            });
            removeCacheTodo(id);
            $popup.classList.remove('popup-active');
        });
    });

    return $task;
}

function addNewTodo(title) {
    const newTodo = {
        id: Date.now(),
        title,
        completed: false,
    };
    saveToCache([newTodo, ...getCacheData()]);
    const $todoList = document.getElementById(LIST_ID);
    const $newTodoItem = getListItem(newTodo);
    $newTodoItem.style.backgroundColor = '#ECFFFA';
    setTimeout(() => {
        $newTodoItem.style.backgroundColor = null;
    }, 10000)
    $todoList.prepend($newTodoItem);
}

const renderTodoList = (data) => {
    const $todos = data.map(getListItem);
    const $todoList = document.getElementById(LIST_ID);
    $todoList.replaceChildren(...$todos);
};

function onFormSubmit(e) {
    e.preventDefault();
    addNewTodo($inputAdd.value);
    this.reset();
}

const installTodoApp = async () => {
    const todos = await getOrFetchTodo();
    renderTodoList(todos);
    const $form = document.getElementById('form');
    $form.addEventListener('submit', onFormSubmit);
};

installTodoApp();

$inputAdd.addEventListener('input', (e) => {
    e.preventDefault();
    if ($inputAdd.value.length >= 1) {
        $btnAdd.classList.add('active-btn');
    }
    else {
        $btnAdd.classList.remove('active-btn');
    }
});

function toggleChange($task, checked) {
    if (checked) {
        $task.classList.add('task__done');
    } else {
        $task.classList.remove('task__done');
    }
    const $input = $task.querySelector('input');
    $input.checked = checked;
}
