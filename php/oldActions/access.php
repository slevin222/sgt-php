<?php

$LOCAL_ACCESS = true;
$output =[
    'success'=>false,
    'errors'=>[]
];

if(empty($_POST['action'])){
    $output['errors'][]= 'no action specified';
    print(json_encode($output));
    exit(); 
}

require_once('mysql_connect.php');

switch($_POST['action']){
    case 'read':
        include('oldActions/read.php');
        break;
    case 'create':
        include('oldActions/create.php');
        break;
    case 'delete':
        include('oldActions/delete.php');
        break;
    default:
        $output['errors'][]= 'invalid action';
}
print_r($output);
$json_output= json_encode($output);
print($json_output);

?>