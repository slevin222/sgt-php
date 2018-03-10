$(document).ready(initialize);


function initialize() {
    firebase.initializeApp(db);
    addClickHandlersToElements();
    database = firebase.database();
    ref = database.ref('Students');
    ref.on('value', listStudents);
}

var database;
var ref;
function addClickHandlersToElements() {
    $(".btn-success").click(addNewStudent);
    $(".btn-default").click(clearSudentFormInputs);
    $("tbody").delegate(".btn-danger", "click", function () {
        $(this).parentsUntil('tbody').remove();
        var deleteId = $(this).attr('id');
        deleteStudent(deleteId);

    });
}

function addNewStudent() {
    var newName = $("#studentName").val();
    var newCourse = $("#studentCourse").val();
    var newGrade = $("#studentGrade").val();
    var newKey = ref.push().getKey()
    var newData = {
        name: newName,
        course: newCourse,
        grade: newGrade,
        id: newKey
    }

    var updates = {};
    updates['/Students/' + newKey] = newData;
    firebase.database().ref().update(updates);

    clearSudentFormInputs();

}

function listStudents(data) {
    $(".allStudents").remove();
    var studentData = data.val();
    var keys = Object.keys(studentData);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        (function () {
            var name = $("<td>").append(studentData[k].name);
            var course = $("<td>").append(studentData[k].course);
            var grade = $("<td>").append(studentData[k].grade);
            var id = studentData[k].id;
            var deleteBtn = $("<button>", {
                type: "button",
                class: "btn btn-danger btn-xs",
                id: id,
                text: "Delete",
                on: {
                    click: function () {
                    }
                }
            });
            var trStudent = $("<tr>").addClass("allStudents").append(name, course, grade, deleteBtn);
            $(".student-list").append(trStudent);
        })();
        calculateGradeAverage(data);
    }
}



function deleteStudent(id) {
    firebase.database().ref().child('/Students/' + id).remove();
}


function clearSudentFormInputs() {
    $("#studentName").val("");
    $("#studentCourse").val("");
    $("#studentGrade").val("");
}

function calculateGradeAverage(data) {
    var studentData = data.val();
    var keys = Object.keys(studentData);
    var total = 0;
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        total += parseFloat(studentData[k].grade);
        average = Math.round(total / keys.length);
    }
    renderGradeAverage(average);
}

function renderGradeAverage(average) {
    $(".avgGrade").text(average);
}