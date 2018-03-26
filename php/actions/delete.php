<?php

if(empty($LOCAL_ACCESS)){
    die('direct access not allowed');
}

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$studentId = filter_var($_POST['student_id'], FILTER_SANITIZE_NUMBER_INT);
$output = [
    'success' => false,
    'data' => [],
    'error' => []
];
try {
    
    $stmt = mysqli_prepare($conn, "DELETE FROM students WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 's', $studentId);
    mysqli_stmt_execute($stmt);
    if ( mysqli_affected_rows($conn) > 0 ){
        $output['success'] = true;
        $output['data'][] = 'Student was successfully deleted';
    } else {
        $output['error'][] = 'There was an error, please try again.';
    }
} catch(Exception $e) {
    http_response_code(500);
    echo $e;
}
?>