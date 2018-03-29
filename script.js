$(document).ready(initializeApp);

// var total = 0;
// var average = 0;
var mainStudentArray;


function initializeApp() {
    addClickHandlersToElements();
    loadStudentData();
}

function addClickHandlersToElements() {
    $("#addButton").click(handleAddClicked);
    $("#cancelButton").click(handleCancelClick);
    $("#nameAZ").click(sortNameOrCourse);
    $("#nameZA").click(sortNameOrCourse);
    $("#courseAZ").click(sortNameOrCourse);
    $("#courseZA").click(sortNameOrCourse);
    $("#gradeLow").click(sortGrades);
    $("#gradeHigh").click(sortGrades);
}

function handleCancelClick() {
    $('input').val('');
}

function clearAddStudentFormInputs() {
    $('input').val('');
}
function showLoadModal() {
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = 'Date : ' + date + ' Time : ' + time;
    $(".responseText").text("Current student information has been loaded from DataBase");
    $(".dateTime").text(dateTime);
    $('#messageDisplay').modal('show');
}

function handleAddClicked() {
    var name = $("#studentName").val();
    var course = $("#studentCourse").val();
    var grade = Math.round($("#studentGrade").val());
    if (typeof name !== 'string' || name.length < 2 || !isNaN(name)) {
        $(".errorText").text('Name must be specified');
        $("#errorDisplay").modal('show');
        return;
    }
    if (typeof course !== 'string' || course.length < 2 || !isNaN(course)) {
        $(".errorText").text('Course must be specified');
        $("#errorDisplay").modal('show');
        return;
    }
    if (isNaN(grade) || grade < 0 || grade > 100 || grade.length < 1) {
        $(".errorText").text('Grade must be a number between 0 - 100');
        $("#errorDisplay").modal('show');
        return;
    }
    addStudent(name, course, grade);
}

function loadStudentData() {
    var dataObject = {
        dataType: "json",
        action: 'read'
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "get",
        url: 'php/actions/datapoint.php',
        success: function (data) {
            mainStudentArray = data.data;
            showLoadModal();
            updateStudentList(mainStudentArray);
        },
        error: function () {
            console.log('error lodaing student data');
            $(".responseText").text("Error- Unable to access current student information");
            showLoadModal();
        }
    });
    $.ajax(dataObject);
}

function renderStudentsOnDom(studentArray) {
    $('#studentDisplay').empty();
    for (var studentArrayIndex = 0; studentArrayIndex < studentArray.length; studentArrayIndex++) {
        (function () {
            var student = studentArray[studentArrayIndex];
            var deleteIndex = studentArray.indexOf(studentArray[studentArrayIndex])
            var sName = $("<td>").text(student.name);
            var sCourse = $("<td>").text(student.course);
            var sGrade = $("<td>").text(student.grade);
            var id = student.id;
            var studentRow = $("<tr>").attr('id', id);
            var toDelete = $("<button>", {
                type: "button",
                class: "btn btn-danger btn-xs",
                id: "delete",
                text: "Delete",
                on: {
                    click: (function (newRow) {
                        return function () {
                            studentToDelete(newRow);
                        };
                    })(studentRow)
                }
            });
            function studentToDelete(parentRow) {
                showDeleteModal(student);
                $("#deleteConfirmBtn").one("click", function () {
                    mainStudentArray.splice(deleteIndex, 1);
                    deleteStudent(student, parentRow);

                })
            }
            var deleteBtn = $("<td>").append(toDelete)
            studentRow.append(sName, sCourse, sGrade, deleteBtn);
            $(".student-list").append(studentRow);
        })();
    }
    calculateGradeAverage(mainStudentArray);
}

function addStudent(studentName, studentCourse, studentGrade) {
    var studentObj = { name: studentName, course: studentCourse, grade: studentGrade };
    mainStudentArray.push(studentObj);
    clearAddStudentFormInputs();

    var dataObject = {
        dataType: "json",
        name: studentName,
        course: studentCourse,
        grade: studentGrade,
        action: 'create'
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "post",
        url: 'php/actions/datapoint.php',
        success: function (response) {
            console.log("server response from add student", response);
            var newStudentId = (response.id + '');
            mainStudentArray[mainStudentArray.length - 1].id = newStudentId;
            updateStudentList();
            calculateGradeAverage(mainStudentArray);
        },
        error: function () {
            console.log("error adding student");
        }
    });
    $.ajax(dataObject);

}

function updateStudentList() {
    renderStudentsOnDom(mainStudentArray);
}

function showDeleteModal(student) {
    $(".nameText").text("Name : " + student.name);
    $(".courseText").text("Course : " + student.course);
    $(".gradeText").text("Grade : " + student.grade);
    $('#deleteStudentModal').modal('show');
}

function deleteStudent(studentToDelete, parentRow) {
    updateListOnDelete(studentToDelete, parentRow);
}

function updateListOnDelete(studentToDelete, parentRow) {
    var dataObject = {
        dataType: "json",
        student_id: studentToDelete.id,
        action: 'delete'
    };
    console.log(" studentTodelete, parentRow, dataObject : ", studentToDelete, parentRow, dataObject)
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "post",
        url: 'php/actions/datapoint.php',
        success: function (response) {
            console.log('delete response ', response);
            console.log(" student array in delete confirmation", mainStudentArray)
            calculateGradeAverage(mainStudentArray);
            parentRow.remove();
        },
        error: function () {
            console.log("delete response error");
        }
    });
    $.ajax(dataObject);
}

function sortNameOrCourse() {
    var studentArray = mainStudentArray.slice();
    var sortMode = $(this).attr('id');
    switch (sortMode) {
        case "nameAZ":
            studentArray.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            renderStudentsOnDom(studentArray);
            break;
        case "nameZA":
            studentArray.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA > nameB) return -1;
                if (nameA < nameB) return 1;
                return 0;
            });
            renderStudentsOnDom(studentArray);
            break;
        case "courseAZ":
            studentArray.sort(function (a, b) {
                var courseA = a.course.toLowerCase();
                var courseB = b.course.toLowerCase();
                if (courseA < courseB) return -1;
                if (courseA > courseB) return 1;
                return 0;
            });
            renderStudentsOnDom(studentArray);
            break;
        case "courseZA":
            studentArray.sort(function (a, b) {
                var courseA = a.course.toLowerCase();
                var courseB = b.course.toLowerCase();
                if (courseA > courseB) return -1;
                if (courseA < courseB) return 1;
                return 0;
            });
            renderStudentsOnDom(studentArray);
            break;
    }
}

function sortGrades() {
    var sortMode = $(this).attr('id');
    var studentArray = mainStudentArray.slice();
    switch (sortMode) {
        case "gradeLow":
            studentArray.sort(function (a, b) {
                if (parseInt(a.grade) < parseInt(b.grade)) return -1;
                if (parseInt(a.grade) > parseInt(b.grade)) return 1;
                return 0;
            });
            renderStudentsOnDom(studentArray);
            break;
        case "gradeHigh":
            studentArray.sort(function (a, b) {
                if (parseInt(a.grade) > parseInt(b.grade)) return -1;
                if (parseInt(a.grade) < parseInt(b.grade)) return 1;
                return 0;
            });
            renderStudentsOnDom(studentArray);
            break;
    }
}

function calculateGradeAverage(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += parseFloat(array[i].grade);
        var average = Math.round(total / array.length);
    }
    renderGradeAverage(average);
}

function renderGradeAverage(average) {
    $(".avgGrade").text(average);
}



