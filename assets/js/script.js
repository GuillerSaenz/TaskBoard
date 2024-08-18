// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 16

  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const card = document.createElement('div');
  card.id = task.id;
  card.draggable = true;
  card.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.dropEffect = "move"
    
    ev.dataTransfer.setData("application/my-app", JSON.stringify({id: ev.target.id, status: task.status, title: task.title, date: task.date, description: task.description, isNew: false}))
  })

  if(task.isNew) {
    let updatedTaskList;
    const refreshedTaskList = JSON.parse(localStorage.getItem("tasks"))
    if(refreshedTaskList !== null) {
      updatedTaskList = [...refreshedTaskList, {id: task.id, title: task.title, date: task.date, description: task.description, status: task.status, isNew: false}]
    } else {
      updatedTaskList = [{id: task.id, title: task.title, date: task.date, description: task.description, status: task.status, isNew: false}]
    }
  
    localStorage.setItem("tasks", JSON.stringify(updatedTaskList))
  }

  card.innerHTML = `<div class="taskCard-header">
      <h3 class="taskCard-title">${task.title}</h3>
      <p class="taskCard-date">Due Date: ${task.date}</p>
    </div>
    <div class="taskCard-body">
      <p class="taskCard-description">${task.description}</p>
    </div>
    <div class="taskCard-footer">
      <button type="button" class="btn-delete" onclick="handleDeleteTask(event)">Delete</button>
    </div>`;

  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList(taskList) {
  if(taskList === null) return;

  todoCards = document.getElementById("todo-cards");
  inProgressCards = document.getElementById("in-progress-cards");
  doneCards = document.getElementById("done-cards");

  taskList.forEach((task) => {
    const card = createTaskCard(task)

    if(task.status === "To Do") {
      todoCards.appendChild(card);
    }

    if(task.status === "In Progress") {
      inProgressCards.appendChild(card);
    }

    if(task.status === "Done") {
      doneCards.appendChild(card);
    }
  })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();
  
  const id = generateTaskId();
  const title = document.getElementById("tasktitle").value;
  const description = document.getElementById("taskdescription").value;
  const date = document.getElementById("datepicker").value;
  const status = "To Do";
  
  const task = {
    id: id,
    title: title,
    description: description,
    date: date,
    status: status,
    isNew: true,
  };

  const array = [task]
  renderTaskList(array)

  document.getElementById("tasktitle").value = ""
  document.getElementById("taskdescription").value = ""
  document.getElementById("datepicker").value = ""
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const cards = document.getElementById("todo-cards");
  const refreshedTaskList = JSON.parse(localStorage.getItem("tasks"))
  
  // remove from DOM
  cards.childNodes.forEach((card) => {
    if(card.id === event.target.parentNode.parentNode.id) {
      cards.removeChild(card)
    }
  })

  // remove from LocalStorage
  let updatedTaskList = refreshedTaskList.filter((task) => task.id !== event.target.parentNode.parentNode.id)
  localStorage.setItem("tasks", JSON.stringify(updatedTaskList))
}

function handleDragOver(event) {
  event.preventDefault();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  event.preventDefault()

  const data = JSON.parse(event.dataTransfer.getData("application/my-app"))

  console.log("target -> ", event.target.childNodes[0].id)


  if(data.status === "To Do") {
    const cards = document.getElementById("todo-cards");
    const updatedCards = Array.from(cards.childNodes).filter((card) => card.id !== data.id);

    cards.replaceChildren(...updatedCards)
  }

  if(data.status === "In Progress") {
    const cards = document.getElementById("in-progress-cards");
    const updatedCards = Array.from(cards.childNodes).filter((card) => card.id !== data.id);

    cards.replaceChildren(...updatedCards)
  }

  if(data.status === "Done") {
    const cards = document.getElementById("done-cards");
    const updatedCards = Array.from(cards.childNodes).filter((card) => card.id !== data.id);

    cards.replaceChildren(...updatedCards)
  }

  if(event.target.childNodes[0].id === "todo-cards") {
    const cards = document.getElementById("todo-cards");
    
    const newCard = createTaskCard({
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      status: data.status,
      isNew: data.isNew,
    })

    cards.replaceChildren(...[...cards.childNodes, newCard])
  }

  if(event.target.childNodes[0].id === "in-progress-cards") {
    const cards = document.getElementById("in-progress-cards");
    
    const newCard = createTaskCard({
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      status: data.status,
      isNew: data.isNew,
    })

    cards.replaceChildren(...[...cards.childNodes, newCard])
  }

  if(event.target.childNodes[0].id === "done-cards") {
    const cards = document.getElementById("done-cards");
    
    const newCard = createTaskCard({
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      status: data.status,
      isNew: data.isNew,
    })

    cards.replaceChildren(...[...cards.childNodes, newCard])
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList(taskList)
});