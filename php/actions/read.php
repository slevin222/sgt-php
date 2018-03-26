<?php

if(empty($LOCAL_ACCESS)){
    die('direct access not allowed');
}

$table = '`students`';
$query = "SELECT * FROM $table";

$result = mysqli_query($conn, $query);

if($result){
/// worked
    if(mysqli_num_rows($result) > 0){
        $output['success'][] = true;
        while($row = mysqli_fetch_assoc($result)){
            $output['data'][] = $row ;
        }
    }else{
        $output['errors'][] = 'no data available';
    }
} else {
    ///the query didn t work
    $output['errors'][] = 'query failed';

}
?>