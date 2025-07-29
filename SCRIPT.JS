const tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");

  const taskText = taskInput.value.trim();
  const taskDate = dateInput.value;
  const taskTime = timeInput.value;

  if (!taskText || !taskDate || !taskTime) {
    alert("Please fill in all fields.");
    return;
  }

  const dateTime = new Date(`${taskDate}T${taskTime}`);
  const id = Date.now();

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onclick = () => li.classList.toggle("completed");

  const content = document.createElement("div");
  content.className = "task-content";

  const label = document.createElement("label");
  label.textContent = taskText;

  const dateSpan = document.createElement("div");
  dateSpan.className = "task-date";
  dateSpan.textContent = `Due: ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  content.appendChild(label);
  content.appendChild(dateSpan);

  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.onclick = () => {
    li.remove();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) tasks.splice(index, 1);
  };

  li.appendChild(checkbox);
  li.appendChild(content);
  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);

  tasks.push({ id, taskText, dateTime, notified: false });

  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
}

// Notifications
if ("Notification" in window) {
  Notification.requestPermission();
}

setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    if (!task.notified && now >= task.dateTime) {
      showNotification(task.taskText);
      task.notified = true;
    }
  });
}, 60000);

function showNotification(taskText) {
  if (Notification.permission === "granted") {
    new Notification("🔔 Reminder", {
      body: `Time for: ${taskText}`,
      icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
    });
  }
}
