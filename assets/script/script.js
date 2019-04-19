let tasksCurrent = [];
let tasksDone = [];
let tasksRemoved = [];

function clearForm() {
    $('.notes-sect .new-task input[name="name"]').val(null);
    $('.notes-sect .new-task textarea').val(null);
}

function addNewTask() {
    $('.plus-item').on('click', function() {
        $('.notes-sect .locker').addClass('active locker-new');
    });

    $(document).on('click', '.notes-sect .locker-new .new-task label.cancel-button', function() {
        $('.notes-sect .locker').removeClass('active locker-new');

        clearForm();
    });

    $(document).on('click', '.notes-sect .new-task label.ok-button', function() { // Клик на ok
        let taskName = document.querySelector('.notes-sect .new-task label:first-of-type input');
        let taskDescription = document.querySelector('.notes-sect .new-task textarea');
        let taskList = document.querySelector('.notes-sect .tab-current .task-list');
        let newTask = {};

        if (taskName.value !== '') {

            newTask.name = taskName.value;
            newTask.description = taskDescription.value;

            tasksCurrent.unshift(newTask);

            $('.notes-sect .locker').removeClass('active locker-new');
            clearForm();

            taskList.innerHTML += `<li><table><tr class="name"><td>${newTask.name}</td></tr><tr class="description"><td>${newTask.description}</td></tr></table><button class="task-list-butt done">Done</button><button class="task-list-butt delete">Delete</button><button class="task-list-butt edit-restore">Edit</button></li>`;
            $('.notes-sect .tab-current li:last-child').prependTo('.notes-sect .tab-current .task-list');

            if (newTask.description == '') { // Скрывает поле описания если оно пустое
                document.querySelector('.notes-sect .tab-current li:first-child tr:last-child').remove();
            }

        };
    });
}

function selectTab() {
    $('.tabs-head').on('click', '.tab-item', function(event) {
        let dataTab = $(event.target).attr('data-tab');

        $('.tab-item').removeClass('tab-active');
        $(this).addClass('tab-active');
        $('.tab-content').removeClass('active');

        if (dataTab === 'current') {
            $('.tab-current').addClass('active');
        } else if (dataTab === 'done') {
            $('.tab-done').addClass('active');
        } else if (dataTab === 'removed') {
            $('.tab-removed').addClass('active');
        };
    });
};

function manageTask() {

    function completeTask() {
        $(document).on('click', '.tab-current li button.done', function() {
            let index = $('.tab-current li button.done').index(this);
            let targetItem = $(this.closest('li'));

            tasksDone.unshift(tasksCurrent[index]);
            tasksCurrent.splice(index, 1);

            targetItem.prependTo($('.tab-done ol'));
        })
    }

    function removeTask() {
        $(document).on('click', '.tab-content:not(.tab-removed) li button.delete', function() {
            let targetItem = $(this.closest('li'));

            if (targetItem.closest('.tab-content').hasClass('tab-current')) {

                let index = $('.tab-current li button.delete').index(this);

                tasksRemoved.unshift(tasksCurrent[index]);
                tasksCurrent.splice(index, 1);

                targetItem.prependTo($('.tab-removed ol'));
                targetItem.find('button.edit-restore').text('Restore');

            } else if (targetItem.closest('.tab-content').hasClass('tab-done')) {
                let index = $('.tab-done li button.delete').index(this);

                tasksRemoved.unshift(tasksDone[index]);
                tasksDone.splice(index, 1);

                targetItem.prependTo($('.tab-removed ol'));
                targetItem.find('button.edit-restore').text('Restore');
            }


        })
    }

    function editTask() {
        let locker = $('.notes-sect .locker');
        let index;
        let itemActive;

        $(document).on('click', '.tab-content:not(.tab-removed) li button.edit-restore', function() {
            index = $(this).closest('.tab-content').find('li').index($(this).closest('li'));
            itemActive =

                locker.addClass('active locker-edit');

            if ($('.notes-sect .tab-current').hasClass('active')) {

                locker.find('.new-task label:first-of-type input').val(tasksCurrent[index].name);
                locker.find('.new-task textarea').val(tasksCurrent[index].description);

            } else if ($('.notes-sect .tab-done').hasClass('active')) {

                locker.find('.new-task label:first-of-type input').val(tasksDone[index].name);
                locker.find('.new-task textarea').val(tasksDone[index].description);
            }
        });

        $(document).on('click', '.notes-sect .locker-edit .new-task label.ok-button', function() {

            let editedTaskName = locker.find('.new-task label:first-of-type input').val();
            let editedTaskDescription = locker.find('.new-task textarea').val();

            if (editedTaskName == '') {
                return;
            }

            if ($('.notes-sect .tab-current').hasClass('active')) {
                let targetItem = $('.tab-current li').eq(index);

                tasksCurrent[index].name = editedTaskName;
                tasksCurrent[index].description = editedTaskDescription;

                targetItem.html('<table><tr><td>' + tasksCurrent[index].name + '</td></tr><tr><td>' + tasksCurrent[index].description + '</td></tr></table>' + '<button class="task-list-butt done">Done</button>' + '<button class="task-list-butt delete">Delete</button>' + '<button class="task-list-butt edit-restore">Edit</button>');

                if (tasksCurrent[index].description == '') { // Скрывает поле описания если оно пустое
                    targetItem.find('tr:last-child').remove();
                }
            } else if ($('.notes-sect .tab-done').hasClass('active')) {
                let targetItem = $('.tab-done li').eq(index);

                tasksDone[index].name = editedTaskName;
                tasksDone[index].description = editedTaskDescription;

                targetItem.html('<table><tr><td>' + tasksDone[index].name + '</td></tr><tr><td>' + tasksDone[index].description + '</td></tr></table>' + '<button class="task-list-butt done">Done</button>' + '<button class="task-list-butt delete">Delete</button>' + '<button class="task-list-butt edit-restore">Edit</button>');

                if (tasksDone[index].description == '') {
                    targetItem.find('tr:last-child').remove();
                }
            }

            locker.removeClass('active locker-edit');
            clearForm();
        });

        $(document).on('click', '.notes-sect .locker-edit .new-task label.cancel-button', function() {
            locker.removeClass('active locker-edit');
            clearForm();
        })

    }

    function restoreTask() {
        $(document).on('click', '.tab-removed li button.edit-restore', function() {
            let index = $('.tab-removed li button.edit-restore').index(this);
            let targetItem = $(this.closest('li'));

            tasksCurrent.unshift(tasksRemoved[index]);
            tasksRemoved.splice(index, 1);

            targetItem.prependTo($('.tab-current ol'));
            targetItem.find('button.edit-restore').text('Edit');
        })

    }

    completeTask();
    removeTask();
    editTask();
    restoreTask();
}

function useLocalStorage() {

    window.addEventListener('load', function() {

    	if (localStorage.getItem('tasksCurrentLocal') === null) {
	    	return;
    	}

        tasksCurrent = JSON.parse(localStorage.getItem('tasksCurrentLocal'));
        tasksDone = JSON.parse(localStorage.getItem('tasksDoneLocal'));
        tasksRemoved = JSON.parse(localStorage.getItem('tasksRemovedLocal'));

        for (let i = 0; i < tasksCurrent.length; i++) {
            let taskList = document.querySelector('.notes-sect .tab-current .task-list');

            taskList.innerHTML += `<li><table><tr class="name"><td>${tasksCurrent[i].name}</td></tr><tr class="description"><td>${tasksCurrent[i].description}</td></tr></table><button class="task-list-butt done">Done</button><button class="task-list-butt delete">Delete</button><button class="task-list-butt edit-restore">Edit</button></li>`;

            if (tasksCurrent[i].description == '') {
                document.querySelector('.notes-sect .tab-current li:last-child tr:last-child').remove();
            }
        }

        for (let i = 0; i < tasksDone.length; i++) {
            let taskList = document.querySelector('.notes-sect .tab-done .task-list');

            taskList.innerHTML += `<li><table><tr class="name"><td>${tasksDone[i].name}</td></tr><tr class="description"><td>${tasksDone[i].description}</td></tr></table><button class="task-list-butt done">Done</button><button class="task-list-butt delete">Delete</button><button class="task-list-butt edit-restore">Edit</button></li>`;

            if (tasksDone[i].description == '') {
                document.querySelector('.notes-sect .tab-done li:last-child tr:last-child').remove();
            }

        }

        for (let i = 0; i < tasksRemoved.length; i++) {
            let taskList = document.querySelector('.notes-sect .tab-removed .task-list');

            taskList.innerHTML += `<li><table><tr class="name"><td>${tasksRemoved[i].name}</td></tr><tr class="description"><td>${tasksRemoved[i].description}</td></tr></table><button class="task-list-butt done">Done</button><button class="task-list-butt delete">Delete</button><button class="task-list-butt edit-restore">Edit</button></li>`;

            if (tasksRemoved[i].description == '') {
                document.querySelector('.notes-sect .tab-removed li:last-child tr:last-child').remove();
            }

        }

    });

    window.addEventListener('unload', function() {

        let jsonTasksCurrent = JSON.stringify(tasksCurrent);
        let jsonTasksDone = JSON.stringify(tasksDone);
        let jsonTasksRemoved = JSON.stringify(tasksRemoved);

        localStorage.setItem('tasksCurrentLocal', jsonTasksCurrent);
        localStorage.setItem('tasksDoneLocal', jsonTasksDone);
        localStorage.setItem('tasksRemovedLocal', jsonTasksRemoved);

    });

}

function init() {
    selectTab();
    addNewTask();
    manageTask();
    useLocalStorage();
};

init();

