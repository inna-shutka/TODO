import { CACHE_KEY } from './index';
import { getTodo } from './index';

function saveToCache(todos) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(todos));
    return todos;
}

function getCacheData() {
    const data = localStorage.getItem(CACHE_KEY);
    return JSON.parse(data || "[]");
}

function getTodoIndxById(todos, id) {
    return todos.findIndex((item) => item.id === id);
}

function editCacheTodo(id, newData) {
    const todos = getCacheData();
    const idx = getTodoIndxById(todos, id);
    if (idx >= 0) {
        todos[idx] = { ...todos[idx], ...newData };
    }
    saveToCache(todos);
}

function removeCacheTodo(id) {
    const todos = getCacheData();
    const idx = getTodoIndxById(todos, id);
    if (idx >= 0) {
        todos.splice(idx, 1);
    }
    saveToCache(todos);
}

async function getOrFetchTodo() {
    const cache = getCacheData();
    if (cache.length) {
        return cache;
    }
    const data = await getTodo();
    return saveToCache(data);
}

export {getOrFetchTodo, removeCacheTodo, editCacheTodo, saveToCache, getCacheData};