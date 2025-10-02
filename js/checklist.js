let lessons = [];
let tasks = [];
const lessonSelect = document.getElementById("lesson-select");
const descriptionArea = document.getElementById("description-area");
const checklistItemsContainer = document.getElementById("checklist-items");
const counterElement = document.getElementById("checklist-counter");

async function loadLessons() {
  try {
    const response = await fetch("../json/lessons.json");
    if (!response.ok)
      throw new Error(
        `Erro de rede ou arquivo não encontrado: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Houve um erro ao carregar o JSON:", error);
  }
}

function insertOptions() {
  lessons.forEach((lesson) => {
    const option = document.createElement("option");
    option.value = lesson.id;
    option.textContent = `Aula ${lesson.date}`;
    lessonSelect.appendChild(option);
  });
}

function findLesson(lessonId) {
  return (lesson = lessons.find((l) => l.id === Number(lessonId)));
}

function setDescription(lessonId) {
  const lesson = findLesson(lessonId);
  descriptionArea.textContent = lesson.description;
}

function setTasks(lesson) {
  tasks = lesson.tasks;
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderChecklist();
    updateCounter();
  }
}

function renderChecklist() {
  checklistItemsContainer.innerHTML = "";
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className =
      "flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition duration-150";
    taskDiv.onclick = () => toggleTask(task.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onclick = (e) => e.stopPropagation();
    checkbox.className =
      "mt-1 w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500";
    checkbox.style.cursor = "pointer";

    const textSpan = document.createElement("span");
    textSpan.className = `text-slate-700 flex-1 ${
      task.completed ? "completed-task" : ""
    }`;
    textSpan.textContent = task.text;

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(textSpan);
    checklistItemsContainer.appendChild(taskDiv);
  });
  updateCounter();
}

function updateCounter() {
  const completed = tasks.filter((task) => task.completed).length;
  counterElement.textContent = `${completed} / ${tasks.length}`;
}

lessonSelect.addEventListener("change", (event) => {
  const value = event.target.value;
  setDescription(value);
  setTasks(findLesson(value));
  renderChecklist();
});

document.addEventListener("DOMContentLoaded", async () => {
  lessons = await loadLessons();
  insertOptions();
});
