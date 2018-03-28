$(document).ready(initializeApp);

var total = 0;
var average = 0;
var getDataFromServer;
var newStudentId;
// var studentToDelete;

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

function sortNameOrCourse() {
    var studentArray = getDataFromServer.data;
    var sortMode = $(this).attr('id');

    switch (sortMode) {
        case "nameAZ":
            studentArray.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            renderStudentsOnSort(studentArray);
            break;
        case "nameZA":
            studentArray.sort(function (a, b) {
                if (a.name > b.name) return -1;
                if (a.name < b.name) return 1;
                return 0;
            });
            renderStudentsOnSort(studentArray);
            break;
        case "courseAZ":
            studentArray.sort(function (a, b) {
                if (a.course < b.course) return -1;
                if (a.course > b.course) return 1;
                return 0;
            });
            renderStudentsOnSort(studentArray);
            break;
        case "courseZA":
            var studentArray = getDataFromServer.data;
            studentArray.sort(function (a, b) {
                if (a.course > b.course) return -1;
                if (a.course < b.course) return 1;
                return 0;
            });
            renderStudentsOnSort(studentArray);
            break;
    }
}


function sortGrades() {
    var sortMode = $(this).attr('id');
    var studentArray = getDataFromServer.data;
    switch (sortMode) {
        case "gradeLow":
            studentArray.sort(function (a, b) {
                if (parseInt(a.grade) < parseInt(b.grade)) return -1;
                if (parseInt(a.grade) > parseInt(b.grade)) return 1;
                return 0;
            });
            renderStudentsOnSort(studentArray);
            break;
        case "gradeHigh":
            var studentArray = getDataFromServer.data;
            studentArray.sort(function (a, b) {
                if (parseInt(a.grade) > parseInt(b.grade)) return -1;
                if (parseInt(a.grade) < parseInt(b.grade)) return 1;
                return 0;
            });
            renderStudentsOnSort(studentArray);
            break;
    }
}


function renderStudentsOnSort(studentArray) {
    $('#studentDisplay').empty();
    for (var studentArrayIndex = 0; studentArrayIndex < studentArray.length; studentArrayIndex++) {
        (function () {
            var student = studentArray[studentArrayIndex];
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
                    click: (function (studentRow) {
                        console.log('clicked')
                        return function () {
                            studentToDelete(studentRow);
                        };
                    })(studentRow)
                }
            });

            function studentToDelete(parentRow) {
                showDeleteModal(student);
                $("#deleteConfirmBtn").click(function () {
                    console.log('clicked')
                    getDataFromServer.data.splice(student, 1);
                    deleteStudent(student, parentRow);
                })
            }
            var deleteBtn = $("<td>").append(toDelete)
            studentRow.append(sName, sCourse, sGrade, deleteBtn);
            $(".student-list").append(studentRow);

        })();
    }
}

function handleAddClicked() {
    addStudent();
}

function handleCancelClick() {
    $("#studentName").val("");
    $("#studentCourse").val("");
    $("#studentGrade").val("");
}

function showLoadModal() {
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = 'Date : ' + date + ' Time : ' + time;
    $(".responseText").text("Current student information has been loaded from DataBase");
    $(".dateTime").text(dateTime);
    $('#messageDisplay').modal('show');
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
            getDataFromServer = data;
            showLoadModal();
            updateStudentList();
        },
        error: function () {
            console.log('errors in ajax');
            $(".responseText").text("Error- Unable to access current student information");
            showLoadModal();
        }
    });
    $.ajax(dataObject);
}

function addStudent() {
    console.log("local data in add", getDataFromServer)
    var studentName = $("#studentName").val();
    var studentCourse = $("#studentCourse").val();
    var studentGrade = $("#studentGrade").val();
    var studentObj = { name: studentName, course: studentCourse, grade: studentGrade };
    console.log('student object', studentObj)
    getDataFromServer.data.push(studentObj);
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
            newStudentId = (response.id + '');
            getDataFromServer.data[getDataFromServer.data.length - 1].id = newStudentId;
            updateStudentList();
        },
        error: function () {
            console.log("error from addStudent");
        }
    });
    $.ajax(dataObject);
    calculateGradeAverage(getDataFromServer);
}

function showDeleteModal(student) {
    console.log("student in delete Modal", student)
    // studentToDelete = $(this).parentsUntil('tbody').bind(this);

    // console.log('studentToDelete in delete modal', studentToDelete)
    $(".nameText").text("Name : " + student.name);
    $(".courseText").text("Course : " + student.course);
    $(".gradeText").text("Grade : " + student.grade);
    $('#deleteStudentModal').modal('show');


    // return studentToDelete;
}

function deleteStudent(studentToDelete) {
    updateListOnDelete(studentToDelete);
}

function updateListOnDelete(studentToDelete) {
    var dataObject = {
        dataType: "json",
        student_id: studentToDelete.id,
        action: 'delete'
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "post",
        url: 'php/actions/datapoint.php',
        success: function (response) {

            console.log(response);
        },
        error: function () {
            console.log("delete response error");
        }
    });
    $.ajax(dataObject);
    updateStudentList()
    calculateGradeAverage(getDataFromServer);
    renderGradeAverage();
}

function updateStudentList() {
    renderStudentsOnDom();
}

function clearAddStudentFormInputs() {
    $("#studentName").val("");
    $("#studentCourse").val("");
    $("#studentGrade").val("");
}

function renderStudentsOnDom() {
    $('#studentDisplay').empty();
    for (var getDataFromServerIndex = 0; getDataFromServerIndex < getDataFromServer.data.length; getDataFromServerIndex++) {
        (function () {
            var student = getDataFromServer.data[getDataFromServerIndex];
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
                    click: (function (studentRow) {
                        return function () {
                            studentToDelete(studentRow);
                        };
                    })(studentRow)
                }
            });

            function studentToDelete(parentRow) {
                showDeleteModal(student);
                $("#deleteConfirmBtn").click(function () {
                    getDataFromServer.data.splice(student, 1);
                    deleteStudent(student, parentRow);
                })
            }
            var deleteBtn = $("<td>").append(toDelete)
            studentRow.append(sName, sCourse, sGrade, deleteBtn);
            $(".student-list").append(studentRow);
        })();
    }
    calculateGradeAverage(getDataFromServer);
}

function calculateGradeAverage(array) {
    total = 0;
    for (var i = 0; i < array.data.length; i++) {
        total += parseFloat(array.data[i].grade);
        average = Math.round(total / array.data.length);
    }
    renderGradeAverage();
}

function renderGradeAverage() {
    $(".avgGrade").text(average);
}



