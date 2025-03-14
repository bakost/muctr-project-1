<?php
    $host = "localhost";
    $port = "5432";
    $dbname = "muctr";
    $user = "server";
    $password = 'GcC4Qnv)%gn_5v/PvHo2Ba^<@Is</g4beWD=4yU=T2A>/;4*ve2d9{x89$xJ';

    $conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

    if ($conn) {
        $result = pg_query($conn, "SELECT * FROM test");
        $data = [];
        
        while ($row = pg_fetch_assoc($result)) {
            $data[] = $row;
        }
        
        echo json_encode($data);
        pg_free_result($result);
        pg_close($conn);
    } else {
        echo json_encode(["error" => "Ошибка соединения"]);
    }
?>