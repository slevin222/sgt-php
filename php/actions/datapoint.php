<?php

// $debugMode = false
$LOCAL_ACCESS = true;

// function debug($message){
//     if($debugMode){
//         print($message);
//     }
// };
// degub mode instead of using a bunch of print statements


require_once('mysql_connect.php');

if(isset($_GET['action'])){
    $newAction = $_GET['action'];
}
if(isset($_POST['action'])){
    $newAction = $_POST['action'];
}

$output = [
    'success' => false,
    'errors' => [],
    'data'=> []
];


switch($newAction){
    case 'read':
        include('read.php');
        break;
    case 'create':
        include('create.php');
        break;
    case 'update':
        include('update.php');
        break;
    case 'delete':
        include('delete.php');
        break;
};

$json_output= json_encode($output);
print($json_output);

?>