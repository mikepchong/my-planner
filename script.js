// ... (keep all the previous code up to the openModal function)

function openModal(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);
    modalDate.textContent = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    taskList.innerHTML = '';
    let dayTasks = tasks[dateKey] || [];

    // Sort tasks: ones with time first
    dayTasks.sort((a, b) => {
        if (a.time && !b.time) return -1;
        if (!a.time && b.time) return 1;
        return 0;
    });

    dayTasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        if (task.time) {
            const timeSpan = document.createElement('span');
            timeSpan.classList.add('task-time');
            timeSpan.textContent = task.time;
            li.appendChild(timeSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        li.appendChild(textSpan);

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
            openModal(dateKey);
        };

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    modal.style.display = 'flex';
    newTaskInput.value = '';
    newTaskInput.focus();
}

addTaskBtn.addEventListener('click', () => {
    let input = newTaskInput.value.trim();
    if (!input || !selectedDate) return;

    let time = null;
    let text = input;

    // Detect time with @ symbol (e.g., "Meeting @ 3pm" or "Lunch @ 12:30")
    const atMatch = input.match(/(.*)@\s*([0-9:?apmAPM.\s-]+)/i);
    if (atMatch) {
        text = atMatch[1].trim();
        time = atMatch[2].trim();
    }

    if (!tasks[selectedDate]) tasks[selectedDate] = [];
    tasks[selectedDate].push({ text, time, completed: false });
    saveTasks(tasks);
    renderCalendar();
    openModal(selectedDate);
});

// Keep the rest of your script the same (enter key, close, navigation, clock, etc.)

// ... (the updateCurrentDateTime and renderCalendar calls at the bottom)
