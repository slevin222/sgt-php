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

reqiure_once('mysql_connect.php');
switch($_POST['action']){
    case 'read':
        include('read.php');
        break;
    case 'create':
        include('create.php');
        break;
    default:
        $output['errors'][]= 'invalid action';
}

$json_output= json_encode($output);
print($json_output);

?>