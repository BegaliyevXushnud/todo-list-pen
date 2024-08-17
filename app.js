const modul = document.getElementById("modul");
const closeModalBtn = document.getElementById("close-btn");
const taskForm = document.getElementById("task-form");
const openList = document.getElementById("open-list");
const pendingList = document.getElementById("pending-list");
const inprogeList = document.getElementById("inproge-list");
const completeList = document.getElementById("complete-list");


let todos = JSON.parse(localStorage.getItem("todos")) || [
    { status: "open", tasks: [] },
    { status: "pending", tasks: [] },
    { status: "inproge", tasks: [] },
    { status: "complete", tasks: [] },
];

let form = {};

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn1").addEventListener("click", () => openModal('open'));
    document.getElementById("btn2").addEventListener("click", () => openModal('pending'));
    document.getElementById("btn3").addEventListener("click", () => openModal('inproge'));
    document.getElementById("btn4").addEventListener("click", () => openModal('complete'));
    closeModalBtn.addEventListener("click", () => toggleModal("none"));
    window.addEventListener("click", function(event) {
        if (event.target === modul) {
            toggleModal("none");
        }
    });
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addTask();
    });
    displayTodos();
});

function displayTodos() {
    openList.innerHTML = "";
    pendingList.innerHTML = "";
    inprogeList.innerHTML = "";
    completeList.innerHTML = "";

    todos.forEach((item, statusIndex) => {
        let taskListHtml = item.tasks.map((task, taskIndex) => {
            return `
                <li>
                    ${task} 
                    <button class="btn btn-sm btn-warning" onclick="editTask(${statusIndex}, ${taskIndex})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask(${statusIndex}, ${taskIndex})">Delete</button>
                </li>`;
        }).join("");

        if (item.status === "open") {
            openList.innerHTML = taskListHtml;
        } else if (item.status === "pending") {
            pendingList.innerHTML = taskListHtml;
        } else if (item.status === "inproge") {
            inprogeList.innerHTML = taskListHtml;
        } else if (item.status === "complete") {
            completeList.innerHTML = taskListHtml;
        }
    });
}

function openModal(status = "") {
    toggleModal("block");
    form = { status };
    taskForm.reset();
    if (status) {
        document.querySelector('select[name="status"]').value = status;
    }
}

function toggleModal(display) {
    modul.style.display = display;
}

function addTask() {
    const status = document.getElementById("select").value;
    const task = document.getElementById("task-input").value;

    if (!task || status === "tans") {
        alert("Please fill out all fields.");
        return;
    }

    if (form.editIndex !== undefined) {
        const [statusIndex, taskIndex] = form.editIndex.split("-").map(Number);
        todos[statusIndex].tasks[taskIndex] = task;
    } else {
        const todoItem = todos.find(item => item.status === status);
        if (todoItem) {
            todoItem.tasks.push(task);
        }
    }

    saveToStorage();
    displayTodos();
    toggleModal("none");
}

function editTask(statusIndex, taskIndex) {
    const taskToEdit = todos[statusIndex].tasks[taskIndex];
    const status = todos[statusIndex].status;
    form = { task: taskToEdit, status, editIndex: `${statusIndex}-${taskIndex}` };
    openModal(status);
    document.getElementById("task-input").value = taskToEdit;
    document.getElementById("select").value = status;
}

function deleteTask(statusIndex, taskIndex) {
    todos[statusIndex].tasks.splice(taskIndex, 1);
    saveToStorage();
    displayTodos();
}

function saveToStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Component creation logic

const addContainerButton = document.getElementById('addContainer');
const removeContainerButton = document.getElementById('removeContainer');
const mainContent = document.getElementById('mainContent');

let containerCount = 0;

function createComponent(title, count) {
    const component = document.createElement('div');
    component.classList.add('component');

    const componentTitle = document.createElement('h3');
    componentTitle.textContent = title;

    const countDisplay = document.createElement('p');
    countDisplay.innerHTML = `Hisob: <span>${count}</span>`;

    const controls = document.createElement('div');
    controls.classList.add('controls');

    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', () => {
        const currentCount = parseInt(countDisplay.querySelector('span').textContent);
        countDisplay.querySelector('span').textContent = currentCount + 1;
    });

    const decrementButton = document.createElement('button');
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', () => {
        const currentCount = parseInt(countDisplay.querySelector('span').textContent);
        countDisplay.querySelector('span').textContent = currentCount - 1;
    });

    controls.appendChild(incrementButton);
    controls.appendChild(decrementButton);

    component.appendChild(componentTitle);
    component.appendChild(countDisplay);
    component.appendChild(controls);

    return component;
}

function createContainer() {
    containerCount++;
    const container = document.createElement('div');
    container.classList.add('column-container');

    const containerTitle = document.createElement('h2');
    containerTitle.textContent = `${containerCount}-komponent`;

    const componentA = createComponent('A komponent', 0);
    const componentB = createComponent('B komponent', 0);

    container.appendChild(containerTitle);
    container.appendChild(componentA);
    container.appendChild(componentB);

    return container;
}

addContainerButton.addEventListener('click', () => {
    const newContainer = createContainer();
    mainContent.appendChild(newContainer);
});

removeContainerButton.addEventListener('click', () => {
    if (mainContent.lastElementChild) {
        mainContent.removeChild(mainContent.lastElementChild);
        containerCount--;
    }
});
