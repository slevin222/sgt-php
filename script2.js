const bindOptions = {
    addButton: "#addButton",
    cancelButton: "#cancelButton",
    nameInput: "#studentName",
    gradeInput: "#studentGrade",
    courseInput: "#studentCourse",
    studentDisplay: "#studentDisplay",
}


const sgt = new SGTContent(bindOptions);

$(document).ready(function () {
    sgt.initialize();

});