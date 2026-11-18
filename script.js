/* =================================
   STUDYSENSE - DATA
================================= */

let subjects = [];
let tasks = [];
let exams = [];


/* =================================
   LOAD SAVED DATA
================================= */

function loadData() {

    try {

        subjects = JSON.parse(
            localStorage.getItem("studySubjects") || "[]"
        );

        tasks = JSON.parse(
            localStorage.getItem("studyTasks") || "[]"
        );

        exams = JSON.parse(
            localStorage.getItem("studyExams") || "[]"
        );

        if (!Array.isArray(subjects)) subjects = [];
        if (!Array.isArray(tasks)) tasks = [];
        if (!Array.isArray(exams)) exams = [];

    } catch (error) {

        subjects = [];
        tasks = [];
        exams = [];

    }

    displaySubjects();
    displayTasks();
    updateDashboard();

}


/* =================================
   SAVE DATA
================================= */

function saveData() {

    localStorage.setItem(
        "studySubjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "studyTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "studyExams",
        JSON.stringify(exams)
    );

}


/* =================================
   UPDATE DASHBOARD
================================= */

function updateDashboard() {

    document.getElementById("subjectCount").textContent =
        subjects.length;

    document.getElementById("taskCount").textContent =
        tasks.length;

    document.getElementById("examCount").textContent =
        exams.length;

    let completedTasks = tasks.filter(
        task => task.completed
    ).length;

    let progress = tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks / tasks.length) * 100
        );

    document.getElementById("progress").textContent =
        progress + "%";
updateReports();
displayTodayStudyPlan();
}


/* =================================
   MY SUBJECTS
================================= */

// Display subjects

function displaySubjects() {

    const subjectList =
        document.getElementById("subjectList");

    subjectList.innerHTML = "";

    if (subjects.length === 0) {

        subjectList.innerHTML =
            '<p class="empty-message">No subjects added yet.</p>';

        return;

    }

    subjects.forEach(function(subject) {

        const card = document.createElement("div");
        card.className = "subject-card";

        const title = document.createElement("h3");
        title.textContent = subject.name;

        const topics = document.createElement("p");
        topics.textContent =
            "Total Topics: " + subject.topics;

        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteSubject(subject.id);

        });

        card.appendChild(title);
        card.appendChild(topics);
        card.appendChild(deleteButton);

        subjectList.appendChild(card);

    });

}


// Add subject

document.getElementById("subjectForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById(
            "subjectName"
        ).value.trim();

        const topics = Number(
            document.getElementById("topicCount").value
        );

        if (
            name === "" ||
            !Number.isInteger(topics) ||
            topics < 1
        ) {

            alert("Please enter valid subject information.");
            return;

        }

        const newSubject = {

            id: Date.now(),
            name: name,
            topics: topics

        };

        subjects.push(newSubject);

        saveData();
        displaySubjects();
        updateDashboard();

        document.getElementById("subjectForm").reset();

        alert("Subject added successfully!");

    });


// Delete subject

function deleteSubject(id) {

    if (confirm("Are you sure you want to delete this subject?")) {

        subjects = subjects.filter(
            subject => subject.id !== id
        );

        saveData();
        displaySubjects();
        updateDashboard();

    }

}


/* =================================
   STUDY PLANNER
================================= */

// Display study tasks

function displayTasks() {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML =
            '<p class="empty-message">No study tasks added yet.</p>';

        return;

    }

    tasks.forEach(function(task) {

        const card = document.createElement("div");

        card.className = task.completed
            ? "task-card completed"
            : "task-card";


        // Task information

        const information = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = task.title;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + task.subject;

        const date = document.createElement("p");
        date.textContent = "Date: " + task.date;

        const time = document.createElement("p");
        time.textContent = "Time: " + task.time;


        information.appendChild(title);
        information.appendChild(subject);
        information.appendChild(date);
        information.appendChild(time);


        // Task buttons

        const actions = document.createElement("div");
        actions.className = "task-actions";


        const completeButton =
            document.createElement("button");

        completeButton.className = "complete-button";

        completeButton.textContent = task.completed
            ? "Completed"
            : "Mark Complete";

        completeButton.addEventListener("click", function() {

            toggleTask(task.id);

        });


        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-task-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        card.appendChild(information);
        card.appendChild(actions);

        taskList.appendChild(card);

    });

}


// Add new task

document.getElementById("taskForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const title = document.getElementById(
            "taskTitle"
        ).value.trim();

        const subject = document.getElementById(
            "taskSubject"
        ).value.trim();

        const date = document.getElementById(
            "taskDate"
        ).value;

        const time = document.getElementById(
            "taskTime"
        ).value;


        if (
            title === "" ||
            subject === "" ||
            date === "" ||
            time === ""
        ) {

            alert("Please complete all task fields.");
            return;

        }


        const newTask = {

            id: Date.now(),
            title: title,
            subject: subject,
            date: date,
            time: time,
            completed: false

        };


        tasks.push(newTask);

        saveData();
        displayTasks();
        updateDashboard();

        document.getElementById("taskForm").reset();

        alert("Your study task has been added!");

    });


// Mark task as completed

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed = !task.completed;

            if (task.completed) {

                const today = new Date();

                task.completedAt =
                    today.getFullYear() + "-" +
                    String(today.getMonth() + 1).padStart(2, "0") + "-" +
                    String(today.getDate()).padStart(2, "0");

            } else {

                task.completedAt = null;

            }

        }

        return task;

    });

    saveData();
    displayTasks();
    updateDashboard();

}

// Delete task

function deleteTask(id) {

    if (confirm("Are you sure you want to delete this task?")) {

        tasks = tasks.filter(
            task => task.id !== id
        );

        saveData();
        displayTasks();
        updateDashboard();

    }

}


/* =================================
   START STUDYSENSE
================================= */

loadData();
/* =================================
   EXAM TRACKER
================================= */

// Display all exams

function displayExams() {

    const examList = document.getElementById("examList");

    examList.innerHTML = "";

    if (exams.length === 0) {

        examList.innerHTML =
            '<p class="empty-message">No exams scheduled yet.</p>';

        return;

    }

    exams.forEach(function(exam) {

        // Create exam card

        const card = document.createElement("div");

        card.className = "exam-card";


        // Exam name

        const title = document.createElement("h3");

        title.textContent = exam.name;


        // Subject name

        const subject = document.createElement("p");

        subject.textContent = "Subject: " + exam.subject;


        // Exam date

        const date = document.createElement("p");

        date.textContent = "Date: " + exam.date;


        // Exam time

        const time = document.createElement("p");

        time.textContent = "Time: " + exam.time;


        // Calculate remaining days

        const countdown = document.createElement("div");

        countdown.className = "exam-countdown";

        const examDateParts = exam.date.split("-");

        const examDate = new Date(
            Number(examDateParts[0]),
            Number(examDateParts[1]) - 1,
            Number(examDateParts[2])
        );

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const difference = examDate.getTime() - today.getTime();

        const remainingDays = Math.round(
            difference / (1000 * 60 * 60 * 24)
        );


        if (remainingDays > 0) {

            countdown.textContent =
                remainingDays + " days remaining";

        } else if (remainingDays === 0) {

            countdown.textContent = "Your exam is today!";

        } else {

            countdown.textContent = "Exam has passed";

        }


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-exam-button";

        deleteButton.textContent = "Delete Exam";

        deleteButton.addEventListener("click", function() {

            deleteExam(exam.id);

        });


        // Add elements to card

        card.appendChild(title);

        card.appendChild(subject);

        card.appendChild(date);

        card.appendChild(time);

        card.appendChild(countdown);

        card.appendChild(deleteButton);


        // Add card to exam list

        examList.appendChild(card);

    });

}


// Add new exam

document.getElementById("examForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name = document.getElementById(
            "examName"
        ).value.trim();


        const subject = document.getElementById(
            "examSubject"
        ).value.trim();


        const date = document.getElementById(
            "examDate"
        ).value;


        const time = document.getElementById(
            "examTime"
        ).value;


        // Check information

        if (
            name === "" ||
            subject === "" ||
            date === "" ||
            time === ""
        ) {

            alert("Please complete all exam information.");

            return;

        }


        // Create new exam

        const newExam = {

            id: Date.now(),

            name: name,

            subject: subject,

            date: date,

            time: time

        };


        exams.push(newExam);


        // Save and update

        saveData();

        displayExams();

        updateDashboard();


        // Clear form

        document.getElementById("examForm").reset();


        alert("Exam added successfully!");

    });


// Delete exam

function deleteExam(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this exam?"
    );


    if (confirmation) {

        exams = exams.filter(function(exam) {

            return exam.id !== id;

        });


        saveData();

        displayExams();

        updateDashboard();

    }

}


// Show saved exams when website opens

displayExams();
// EXAM READINESS

let readinessData = [];

function loadReadiness() {
    try {
        readinessData = JSON.parse(
            localStorage.getItem("studyReadiness") || "[]"
        );

        if (!Array.isArray(readinessData)) {
            readinessData = [];
        }
    } catch (error) {
        readinessData = [];
    }

    displayReadiness();
}

function saveReadiness() {
    localStorage.setItem(
        "studyReadiness",
        JSON.stringify(readinessData)
    );
}

function displayReadiness() {
    const readinessList = document.getElementById("readinessList");

    readinessList.innerHTML = "";

    readinessData.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "readiness-card";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const background = document.createElement("div");
        background.className = "progress-background";

        const fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = item.level + "%";

        background.appendChild(fill);

        const percentage = document.createElement("p");
        percentage.className = "readiness-percentage";
        percentage.textContent = item.level + "% Ready";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            deleteReadiness(item.id);
        });

        card.appendChild(title);
        card.appendChild(background);
        card.appendChild(percentage);
        card.appendChild(deleteButton);

        readinessList.appendChild(card);
    });
}

document.getElementById("readinessForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("readinessExam").value.trim();
    const level = Number(document.getElementById("readinessLevel").value);

    const newItem = {
        id: Date.now(),
        name: name,
        level: level
    };

    readinessData.push(newItem);

    saveReadiness();
    displayReadiness();

    this.reset();

    alert("Exam readiness saved successfully!");
});

function deleteReadiness(id) {
    const confirmDelete = confirm("Are you sure you want to delete this progress?");

    if (confirmDelete) {
        readinessData = readinessData.filter(function(item) {
            return item.id !== id;
        });

        saveReadiness();
        displayReadiness();
    }
}

loadReadiness();
// FOCUS TIMER

let timerSeconds = 25 * 60;
let timerInterval = null;
let currentMode = "study";

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    document.getElementById("timerDisplay").textContent =
        formattedMinutes + ":" + formattedSeconds;
}

function startTimerFunction() {
    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(function() {

        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

            alert("Time is over!");

        }

    }, 1000);
}

function pauseTimerFunction() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimerFunction() {
    pauseTimerFunction();

    if (currentMode === "study") {
        timerSeconds = 25 * 60;
    } else {
        timerSeconds = 5 * 60;
    }

    updateTimerDisplay();
}

function changeTimerMode(mode) {
    pauseTimerFunction();

    currentMode = mode;

    if (mode === "study") {
        timerSeconds = 25 * 60;

        document.getElementById("timerMode").textContent = "Study Time";

        document.getElementById("studyMode").classList.add("active");
        document.getElementById("breakMode").classList.remove("active");

    } else {
        timerSeconds = 5 * 60;

        document.getElementById("timerMode").textContent = "Break Time";

        document.getElementById("breakMode").classList.add("active");
        document.getElementById("studyMode").classList.remove("active");
    }

    updateTimerDisplay();
}

document.getElementById("startTimer").addEventListener("click", startTimerFunction);

document.getElementById("pauseTimer").addEventListener("click", pauseTimerFunction);

document.getElementById("resetTimer").addEventListener("click", resetTimerFunction);

document.getElementById("studyMode").addEventListener("click", function() {
    changeTimerMode("study");
});

document.getElementById("breakMode").addEventListener("click", function() {
    changeTimerMode("break");
});

updateTimerDisplay();
// STUDY REPORTS

function updateReports() {

    document.getElementById("reportSubjects").textContent =
        subjects.length;

    document.getElementById("reportTasks").textContent =
        tasks.length;

    const completedTasks = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    document.getElementById("reportCompleted").textContent =
        completedTasks;

    document.getElementById("reportExams").textContent =
        exams.length;

    const completionRate = tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

    document.getElementById("reportCompletionRate").textContent =
        completionRate + "%";

    document.getElementById("reportProgressBar").style.width =
        completionRate + "%"; 
        displayWeeklyChart();
}
updateReports();

/* STUDY REPORTS NAVIGATION */

const reportsLink = document.querySelector(
    '.navigation a[href="#reports"]'
);

const reportsSection = document.getElementById("reports");

if (reportsLink && reportsSection) {

    reportsLink.addEventListener("click", function(event) {

        event.preventDefault();

        reportsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}
/* WEEKLY STUDY CHART */

function displayWeeklyChart() {

    const chart = document.getElementById("weeklyChart");

    if (!chart) return;

    chart.innerHTML = "";

    const today = new Date();

    const startOfWeek = new Date(today);

    const dayNumber = (today.getDay() + 6) % 7;

    startOfWeek.setDate(today.getDate() - dayNumber);

    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays = [];

    const dayNames = [
        "Mon", "Tue", "Wed", "Thu",
        "Fri", "Sat", "Sun"
    ];

    for (let i = 0; i < 7; i++) {

        const date = new Date(startOfWeek);

        date.setDate(startOfWeek.getDate() + i);

        const dateKey =
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");

        const count = tasks.filter(function(task) {

            return task.completed === true &&
                   task.completedAt === dateKey;

        }).length;

        weekDays.push({
            name: dayNames[i],
            count: count
        });

    }

    const maxCount = Math.max(
        1,
        ...weekDays.map(day => day.count)
    );

    weekDays.forEach(function(day) {

        const dayColumn = document.createElement("div");

        dayColumn.className = "weekly-day";

        const countLabel = document.createElement("strong");

        countLabel.textContent = day.count;

        const barBackground =
            document.createElement("div");

        barBackground.className =
            "weekly-bar-background";

        const bar = document.createElement("div");

        bar.className = "weekly-bar";

        bar.style.height =
            (day.count / maxCount * 100) + "%";

        const dayLabel = document.createElement("span");

        dayLabel.textContent = day.name;

        barBackground.appendChild(bar);

        dayColumn.appendChild(countLabel);

        dayColumn.appendChild(barBackground);

        dayColumn.appendChild(dayLabel);

        chart.appendChild(dayColumn);

    });

}
/* TODAY'S STUDY PLAN */

function displayTodayStudyPlan() {

    const planContainer =
        document.getElementById("todayStudyPlan");

    if (!planContainer) return;

    planContainer.innerHTML = "";

    const today = new Date();

    const todayDate =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    const todayTasks = tasks.filter(function(task) {
        return task.date === todayDate;
    });

    if (todayTasks.length === 0) {

        planContainer.innerHTML =
            '<p class="empty-message">No study tasks planned for today. Add a task in Study Planner!</p>';

        return;
    }

    todayTasks.forEach(function(task) {

        const studyItem = document.createElement("div");
        studyItem.className = "study-item";

        const details = document.createElement("div");

        const subjectTitle = document.createElement("h3");
        subjectTitle.textContent = task.subject || "Study";

        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.title;

        const timeLabel = document.createElement("span");

        if (task.time) {

            const timeParts = task.time.split(":");
            let hours = Number(timeParts[0]);
            const minutes = timeParts[1];

            const period = hours >= 12 ? "PM" : "AM";

            hours = hours % 12 || 12;

            timeLabel.textContent =
                String(hours).padStart(2, "0") +
                ":" + minutes + " " + period;

        } else {

            timeLabel.textContent = "Time not set";

        }

        details.appendChild(subjectTitle);
        details.appendChild(taskDescription);

        studyItem.appendChild(details);
        studyItem.appendChild(timeLabel);

        planContainer.appendChild(studyItem);

    });

}
displayTodayStudyPlan();