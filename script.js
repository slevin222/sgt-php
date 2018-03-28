$(document).ready(initializeApp);

var total = 0;
var average = 0;
var getDataFromServer;
var newStudentId;
var studentToDelete;

function initializeApp() {
    addClickHandlersToElements();
    loadStudentData();
    $('#messageDisplay').modal('hide');
    $("#deleteStudentModal").modal('hide');

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
    // $("tbody").delegate(".btn-danger", "click", showDeleteModal);
}

function showDeleteModal() {
    studentToDelete = $(this).parentsUntil('tbody').bind(this);
    var info = $(this).parentsUntil('tbody').text();
    console.log('info in show modal', info)
    $(".deleteText").text(info);
    $('#deleteStudentModal').modal('show');


    return studentToDelete;
}

function deleteStudent(studentToDelete) {
    console.log('called deleteStudent', studentToDelete)
    updateArrayDel(getDataFromServer.data);
    $(studentToDelete).remove();
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
            var sName = $("<td>").append(studentArray[studentArrayIndex].name);
            var sCourse = $("<td>").append(studentArray[studentArrayIndex].course);
            var sGrade = $("<td>").append(studentArray[studentArrayIndex].grade);
            var id = studentArray[studentArrayIndex].id;
            var toDelete = $("<button>", {
                type: "button",
                class: "btn btn-danger btn-xs",
                id: id,
                text: "Delete",
                on: {
                    click: function () {
                    }
                }
            });
            var deleteBtn = $("<td>").append(toDelete)
            var trStudent = $("<tr>").append(sName, sCourse, sGrade, deleteBtn);
            $(".student-list").append(trStudent);

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
                            getDataFromServer.splice(student, 1);
                            deleteStudent(student, parentRow);
                        })
                    }
                    var deleteBtn = $("<td>").append(toDelete)
                    studentRow.append(sName, sCourse, sGrade, deleteBtn);
                    $(".student-list").append(studentRow);
                })();
            }
            calculateGradeAverage(getDataFromServer);
        },
        error: function () {
            console.log('errors in ajax');
            $(".responseText").text("Error- Unable to access current student information");
            $('#dataModal').modal('show');
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

function updateArrayDel() {
    var btnClick = $(event.target).attr('id');
    console.log(btnClick + '');
    for (var i = 0; i < getDataFromServer.data.length; i++) {
        if (getDataFromServer.data[i].id === btnClick) {
            var idToDelete = getDataFromServer.data[i].id;
            var indexToDelete = getDataFromServer.data.indexOf(getDataFromServer.data[i]);
            getDataFromServer.data.splice(indexToDelete, 1);
            break;
        }
    }
    var dataObject = {
        dataType: "json",
        student_id: idToDelete,
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
    calculateGradeAverage(getDataFromServer);
    renderGradeAverage();
}

function clearAddStudentFormInputs() {
    $("#studentName").val("");
    $("#studentCourse").val("");
    $("#studentGrade").val("");
}

function renderStudentOnDom() {
    var newStudent = getDataFromServer.data[getDataFromServer.data.length - 1];
    var sName = $("<td>").append(newStudent.name);
    var sCourse = $("<td>").append(newStudent.course);
    var sGrade = $("<td>").append(newStudent.grade);
    var toDelete = $("<button>", {
        type: "button",
        class: "btn btn-danger btn-xs",
        id: id,
        text: "Delete",
        on: {
            click: function () {
            }
        }
    });
    var deleteBtn = $("<td>").append(toDelete)
    var trStudent = $("<tr>").append(sName, sCourse, sGrade, deleteBtn);
    $(".student-list").append(trStudent);
}

function updateStudentList() {
    renderStudentOnDom();
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



