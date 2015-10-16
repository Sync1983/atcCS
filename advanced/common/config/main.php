<?php
return [
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'components' => [
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 6379,
            'database' => 0,
        ],
        'db' =>[
          'class' => 'yii\db\Connection',
          'dsn' => 'pgsql:host=localhost;port=5432;dbname=atccs',
          'username' => 'client',
          'password' => 'client',
          'charset' => 'utf8',
        ], // PostgreSQL
    ],
];
