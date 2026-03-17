document.addEventListener("DOMContentLoaded", runFun);
function runFun() {
  try {
    document.getElementById("addTask").addEventListener("click", addTask);
    loadSavedTask();

    changeCount();
    const addTaskBtn = document.getElementById("addNewTask");
    addTaskBtn.addEventListener("click", visibleTakeTaskBox);

    const todoTemp = document.getElementById("todoTemplate");
    const progressTemp = document.getElementById("inProgress");
    const doneTemp = document.getElementById("doneTemp");

    let currentItem = null;

    function dragAndDrop(template) {
      template.addEventListener("dragstart", (e) => {
        // console.log("START");
        currentItem = e.target.closest("li");
        currentItem.classList.add("hideTask");
      });
      template.addEventListener("dragend", (e) => {
        // console.log("END");
      });

      template.addEventListener("dragenter", (e) => {
        e.preventDefault();
        template.classList.add("hover-over");
      });
      template.addEventListener("dragleave", (e) => {
        e.preventDefault();
        template.classList.remove("hover-over");
      });
      template.addEventListener("dragover", (e) => {
        e.preventDefault(); // allow browser to put element on other.
      });
      template.addEventListener("drop", (e) => {
        currentItem.classList.remove("hideTask");
        let currentUl = template.children[1].children[0];
        currentUl.appendChild(currentItem);
        template.classList.remove("hover-over");
        changeCount();
        saveTask();
      });
    }
    dragAndDrop(todoTemp);
    dragAndDrop(progressTemp);
    dragAndDrop(doneTemp);
  } catch (error) {
    console.log("Opps!! E: ", error);
  }
}

function addTask() {
  const taskHeading = document.getElementById("taskHeading").value;
  const taskDecription = document.getElementById("taskDecription").value;
  appendTask(taskHeading, taskDecription);
  saveTask();
  hideTakeTaskBox();
}

function appendTask(taskHeading, taskDecription) {
  try{
    if (!taskHeading) {
    taskHeading = "Untitled Task";
  }
  if (!taskDecription.trim()) {
    taskDecription = "No description";
  }
  const todoItemsUl = document.getElementById("todoItems");

  let li = document.createElement("li");
  li.className = "todoListItem";
  li.setAttribute("draggable", "true");
  li.innerHTML = `<div class="task-div">
            <div>
              <h3 class="h3">${taskHeading}</h3>
            </div>
            <div class="discription-div">
              <p>
                ${taskDecription}
              </p>
            </div>
            <div>
              <button type="button" class="task-delete-btn" onclick="deleteTask(this)">
                Delete
              </button>
            </div>
          </div>`;

  todoItemsUl.appendChild(li);
  changeCount();
  }catch(error){
    console.log('Error to append Task, E: ',error);
  }
}

function changeCount() {
  const allUl = document.querySelectorAll("ul");
  const allCounter = document.querySelectorAll(".counter");
  let totalLengh = [];
  allUl.forEach((item) => {
    totalLengh.push(item.childElementCount);
  });
  let i = 0;
  allCounter.forEach((e) => {
    e.innerText = totalLengh[i];
    i++;
  });
}

function saveTask() {
  try {
    const todoItem = document.getElementById("todoItems").innerHTML;
    const inProgressItem = document.getElementById("progressUl").innerHTML;
    const doneItem = document.getElementById("doneTempUl").innerHTML;

    let taskList = {
      todoItem: todoItem,
      inProgressItem: inProgressItem,
      doneItem: doneItem,
    };
    localStorage.setItem("taskList", JSON.stringify(taskList));
  } catch (err) {
    console.log("Error in Save Task");
  }
}

function loadSavedTask() {
  try {
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    if (!taskList) return;
    document.getElementById("todoItems").innerHTML = taskList.todoItem;
    document.getElementById("progressUl").innerHTML = taskList.inProgressItem;
    document.getElementById("doneTempUl").innerHTML = taskList.doneItem;
  } catch (error) {
    console.log("Error to load data : ", error);
  }
}

function visibleTakeTaskBox() {
  document.querySelector("body").className = "modal-open";
  const takeTaskDiv = document.querySelector(".take-input");
  takeTaskDiv.className = "take-input";
}

function hideTakeTaskBox() {
  document.querySelector("body").className = "";
  const takeTaskDiv = document.querySelector(".take-input");
  const inputValues = document.querySelectorAll(".clearValue");
  inputValues.forEach((e) => {
    e.value = "";
  });
  takeTaskDiv.className = "take-input take-task-visibility";
}

function deleteTask(deletBtn) {
  const task = deletBtn.parentElement.parentElement.parentElement;
  task.remove();
  saveTask();
}
