const monthYear = document.getElementById('month-year');
const daysContainer = document.getElementById('days');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const modal = document.getElementById('modal');
const modalDate = document.getElementById('modal-date');
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const closeModalBtn = document.getElementById('close-modal');

let currentDate = new Date();
let selectedDate = null;

// Load tasks from localStorage
function loadTasks() {
    const tasks = localStorage.getItem('plannerTasks');
    return tasks ? JSON.parse(tasks) : {};
}

function saveTasks(tasks) {
    localStorage.setItem('plannerTasks', JSON.stringify(tasks));
}

let tasks = loadTasks();

function renderCalendar() {
    daysContainer.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    // Previous month days
    for (let i = firstDay; i > 0; i--) {
        const dayEl = createDayElement(prevLastDate - i + 1, true);
        daysContainer.appendChild(dayEl);
    }

    // Current month
    for (let i = 1; i <= lastDate; i++) {
        const dayEl = createDayElement(i, false);
        const dateKey = `${year}-${month + 1}-${i}`;
        
        if (tasks[dateKey] && tasks[dateKey].length > 0) {
            dayEl.classList.add('has-tasks');
        }

        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayEl.classList.add('today');
        }

        daysContainer.appendChild(dayEl);
    }

    // Next month (fill grid)
    const totalCells = daysContainer.children.length;
    const remaining = 42 - totalCells;
    for (let i = 1; i <= remaining; i++) {
        const dayEl = createDayElement(i, true);
        daysContainer.appendChild(dayEl);
    }
}

function createDayElement(dayNum, isOtherMonth) {
    const day = document.createElement('div');
    day.classList.add('day');
    if (isOtherMonth) day.classList.add('other-month');
    day.textContent = dayNum;

    day.addEventListener('click', () => {
        if (isOtherMonth) return;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        selectedDate = `${year}-${month + 1}-${dayNum}`;
        openModal(selectedDate);
    });

    return day;
}

function openModal(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);
    modalDate.textContent = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    taskList.innerHTML = '';
    const dayTasks = tasks[dateKey] || [];

    dayTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');

        li.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks(tasks);
            li.classList.toggle('completed');
        });

        const delBtn = document.createElement('span');
        delBtn.textContent = '✕';
        delBtn.style.cursor = 'pointer';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            dayTasks.splice(index, 1);
            saveTasks(tasks);
            renderCalendar();
            openModal(dateKey); // Refresh
        };

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    modal.style.display = 'flex';
    newTaskInput.value = '';
    newTaskInput.focus();
}

addTaskBtn.addEventListener('click', () => {
    const text = newTaskInput.value.trim();
    if (!text || !selectedDate) return;

    if (!tasks[selectedDate]) tasks[selectedDate] = [];
    tasks[selectedDate].push({ text, completed: false });
    saveTasks(tasks);
    renderCalendar();
    openModal(selectedDate);
});

newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
// NEW: Live Clock and Date
function updateCurrentDateTime() {
    const now = new Date();
    
    // Full date like "Sunday, December 14, 2025"
    document.getElementById('current-date').textContent = 
        now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Time like "03:45 PM"
    document.getElementById('current-time').textContent = 
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

updateCurrentDateTime(); // Initial call
setInterval(updateCurrentDateTime, 1000); // Update every second
