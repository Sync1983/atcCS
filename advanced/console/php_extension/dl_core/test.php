<?php

  $data = [
    15 => [
      'id' => 15,
      'text' => 'asada',      
    ],
    18 => [
      'id' => 18,
      'text' => 'b'
      ]
  ];
echo "Result: \r\n";

echo dl_array(&$data,'asd',0);

echo "\r\n End \r\n";
