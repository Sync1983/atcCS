<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'console\controllers',
    'aliases' => [
      // Set the editor language dir
      '@migrate_data_dir' => '@console/migrate_data/',
      //'@load_data_dir' => '/1G/gitHub/atcCS/advanced/console/migrate_data/',
      '@load_data_dir' => 'd:/gitHub/atcCS/advanced/console/migrate_data/',
    ],
    'components' => [
        'mongodb' => [
            'class' => '\yii\mongodb\Connection',
            'dsn'   => 'mongodb://sync:test@localhost:27017/atc',
        ],
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 6379,
            'database' => 0,
        ],
        'db' =>[
          'class' => 'yii\db\Connection',
          'dsn' => 'pgsql:host=atcserv;port=6543;dbname=atccs',
          'username' => 'client',
          'password' => 'client',
          'charset' => 'utf8',
        ], // PostgreSQL
        'log' => [
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'wsdl' => [
          'class' => \backend\models\soap\WSDL::className(),
          'headerTags' => [
            'xmlns:soap'        => "http://schemas.xmlsoap.org/wsdl/soap/",
            'xmlns:tm'          => "http://microsoft.com/wsdl/mime/textMatching/",
            'xmlns:soapenc'     => "http://schemas.xmlsoap.org/soap/encoding/",
            'xmlns:mime'        => "http://schemas.xmlsoap.org/wsdl/mime/",
            'xmlns:s'           => "http://www.w3.org/2001/XMLSchema",
            'xmlns:soap12'      => "http://schemas.xmlsoap.org/wsdl/soap12/",
            'xmlns:http'        => "http://schemas.xmlsoap.org/wsdl/http/",
            'xmlns:atcWSDL'     => "http://schemas.xmlsoap.org/wsdl/",
            'xmlns:tns'         => 'atcWSDL',
            'targetNamespace'   => 'atcWSDL'
          ],
          'wsdlPrefix'    => 'atcWSDL:'
        ]
    ],
    'params' => $params,
];
