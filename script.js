$(document).ready(initializeApp);

// var student_array = [];
var total = 0;
var average = 0;
var getDataFromServer;
var newStudentId;

/***********************
 * EXAMPLE FOR AN CHICK FUNCTION
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input:
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/

function initializeApp() {
    addClickHandlersToElements();
    loadStudentData();
    $('#dataModal').modal('hide');
    //
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/

function addClickHandlersToElements() {
    $(".btn-success").click(handleAddClicked);
    $(".btn-default").click(handleCancelClick);
    $("tbody").delegate(".btn-danger", "click", function () {
        updateArrayDel(getDataFromServer.data);
        $(this).parentsUntil('tbody').remove();
    });
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */

function handleAddClicked() {
    addStudent();
}

/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */

function handleCancelClick() {
    $("#studentName").val("");
    $("#studentCourse").val("");
    $("#studentGrade").val("");
}

/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */

function addStudent() {
    var studentName = $("#studentName").val();
    var studentCourse = $("#studentCourse").val();
    var studentGrade = $("#studentGrade").val();
    var studentObj = { name: studentName, course: studentCourse, grade: studentGrade };
    getDataFromServer.data.push(studentObj);
    clearAddStudentFormInputs();

    var dataObject = {
        dataType: "json",
        api_key: "SNBklaXTqN",
        name: studentName,
        course: studentCourse,
        grade: studentGrade,
        action: 'create'
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "post",
        url: '../php/access.php',
        success: function (response) {

            newStudentId = response.new_id;
            getDataFromServer.data[getDataFromServer.data.length - 1].id = newStudentId;
            updateStudentList();
        },
        error: function () {
            console.log("error");
        }
    });
    $.ajax(dataObject);
}

/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
    $("#studentName").val("");
    $("#studentCourse").val("");
    $("#studentGrade").val("");

}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */

function renderStudentOnDom() {
    var newStudent = getDataFromServer.data[getDataFromServer.data.length - 1];
    var sName = $("<td>").append(newStudent.name);
    var sCourse = $("<td>").append(newStudent.course);
    var sGrade = $("<td>").append(newStudent.grade);
    var trStudent = $("<tr>").append(sName, sCourse, sGrade);
    var deleteBtn = $("<button>", {
        type: "button",
        class: "btn btn-danger btn-xs",
        text: "Delete",
        id: newStudentId
    });
    trStudent = $("<tr>").append(sName, sCourse, sGrade, deleteBtn);
    $(".student-list").append(trStudent);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList() {
    renderStudentOnDom();
    // calculateGradeAverage(student_array);
    // renderGradeAverage();
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array) {
    total = 0;
    for (var i = 0; i < array.data.length; i++) {
        total += parseFloat(array.data[i].grade);
        average = Math.round(total / array.data.length);
    }
    renderGradeAverage();
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage() {
    $(".avgGrade").text(average);
}

function updateArrayDel() {
    var btnClick = parseInt($(event.target).attr('id'));
    console.log(btnClick);
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
        api_key: "SNBklaXTqN",
        student_id: idToDelete
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "post",
        url: 'https://s-apis.learningfuze.com/sgt/delete',
        success: function (response) {

            console.log(response);
        },
        error: function () {
            console.log("error");
        }
    });
    $.ajax(dataObject);
    calculateGradeAverage(getDataFromServer);
    renderGradeAverage();
}

function loadStudentData() {
    var dataObject = {
        dataType: "json",
        api_key: "SNBklaXTqN",
        action: 'read'
    };
    $.ajax({
        data: dataObject,
        dataType: "json",
        method: "post",
        url: '../php/access.php',
        success: function (data) {
            getDataFromServer = data;
            $(".responseText").text("current student data has been loaded successfully");
            $('#dataModal').modal('show');
            for (var getDataFromServerIndex = 0; getDataFromServerIndex < getDataFromServer.data.length; getDataFromServerIndex++) {
                (function () {
                    var sName = $("<td>").append(getDataFromServer.data[getDataFromServerIndex].name);
                    var sCourse = $("<td>").append(getDataFromServer.data[getDataFromServerIndex].course);
                    var sGrade = $("<td>").append(getDataFromServer.data[getDataFromServerIndex].grade);
                    var id = getDataFromServer.data[getDataFromServerIndex].id;
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
                    var trStudent = $("<tr>").append(sName, sCourse, sGrade, deleteBtn);
                    $(".student-list").append(trStudent);
                })();
            }
            calculateGradeAverage(getDataFromServer);
        },
        error: function () {
            $(".responseText").text("Error- Unable to access current student information");
            $('#dataModal').modal('show');

        }
    });
    $.ajax(dataObject);
}
