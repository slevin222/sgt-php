<?php
if(empty($LOCAL_ACCESS)){
    die('direct access not allowed');
}
$query = "SELECT * FROM `students`";

$result = mysqli_query($conn, $query);
print($result);

$output =[
    'success' => false,
    'error' => [],
    'data'=>[]
];

if(!empty($result)){
    if(mysqli_num_rows($result)!== 0){
        $output['success'] = true;
        while($row = mysqli_fetch_assoc($result)){
            $otuput['data'][]= $row;
        }
        }else{
            $output['errors'] = 'no data available';
    }
}else{
$output['errors'][]=mysql_error($conn);
     
}

?>