<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);


return [
    'id' => 'app-backend',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'backend\controllers',
    'bootstrap' => ['log'],
    'modules' => [],
    'components' => [
        'user' => [
            'identityClass' => \common\models\User::className(),
            'enableAutoLogin' => false,
        ],
        //'mongodb' => [
        //    'class' => '\yii\mongodb\Connection',
        //    'dsn'   => 'mongodb://sync:test@localhost:27017/atc',
        //],
        //'redis' => [
        //    'class' => 'yii\redis\Connection',
        //    'hostname' => 'localhost',
        //    'port' => 6379,
        //    'database' => 0,
        //],
        'db' =>[
          'class' => 'yii\db\Connection',
          'dsn' => 'pgsql:host=atcserv;port=6543;dbname=atccs',
          'username' => 'client',
          'password' => 'client',
          'charset' => 'utf8',
          'enableQueryCache' => false,
          'queryCacheDuration' => -1
        ], // PostgreSQL
        'log' => [
            'traceLevel' => 3, //YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class'       => 'yii\log\FileTarget',
                    'levels'      => ['info', 'error', 'warning','trace'],
                    //'categories'  => ['application'],
                    //'logVars'     => ['_GET', '_POST', '_COOKIE']
                ],
                [
                    'class'       => 'yii\log\SyslogTarget',
                    'levels'      => 0,
		    //'prefix'	  => 'atccs',
                    //'categories'  => ['application'],
                    //'logVars'     => ['_GET', '_POST', '_COOKIE']
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'response' => [
          'formatters' => [
            'rest' => [
              'class'   => backend\models\response\SoapXmlResponse::className(),
              'rootTag' => 'answer'
            ]
          ],
        ]        
    ],
    'params' => $params,
];
