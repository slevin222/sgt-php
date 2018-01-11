/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.
 */
var student_array = [];
var total = 0;
var average = 0;
var counter= 0;

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
function initializeApp(){
   addClickHandlersToElements();
//
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $(".btn-success").click(handleAddClicked);
    $(".btn-default").click(handleCancelClick);
    $("tbody").delegate(".btn-danger","click", function(){
        updateArrayDel();
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
function handleCancelClick(){
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
function addStudent(){
   var studentName = $("#studentName").val();
   var studentCourse =  $("#studentCourse").val();
   var studentGrade = $("#studentGrade").val();
   var studentObj = {name:studentName, course:studentCourse, grade:studentGrade, id:counter};
   student_array.push(studentObj);
   updateStudentList();
   clearAddStudentFormInputs();

}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
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

    var newStudent = student_array[student_array.length - 1];
    var sName = $("<td>").append(newStudent.name);
    var sCourse = $("<td>").append(newStudent.course);
    var sGrade = $("<td>").append(newStudent.grade);
    var trStudent = $("<tr>").append(sName, sCourse, sGrade);
    var deleteBtn = $("<button>", {
        type: "button",
        class: "btn btn-danger btn-xs",
        text: "Delete",
        id: counter
    });
    var trStudent = $("<tr>").append(sName, sCourse, sGrade, deleteBtn);
    $(".student-list").append(trStudent);
    counter++;


}
/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(){
    renderStudentOnDom();
    calculateGradeAverage(student_array);
    renderGradeAverage();
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){
    for(var i = 0; i < array.length; i++){
    total += parseFloat(array[i].grade);
    }
    average = Math.round(total / array.length);
    total = 0;


}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(){
    $(".avgGrade").text(average);
}

function updateArrayDel(){
    var btnClick = parseInt($(event.target).attr('id'));
    for(var i =0; i < counter; i++){
        if(student_array[i].id === btnClick){
            student_array.splice(i, 1);
            calculateGradeAverage(student_array);
            renderGradeAverage();
            break;
        }
    }
}



