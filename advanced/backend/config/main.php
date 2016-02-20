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
          'dsn' => 'pgsql:host=localhost;port=5432;dbname=atccs',
          'username' => 'client',
          'password' => 'client',
          'charset' => 'utf8',
          'enableQueryCache' => false,
          'queryCacheDuration' => -1
        ], // PostgreSQL
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['info', 'error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'response' => [
          'formatters' => [
            'xml' => backend\models\response\AtcXmlResponse::class,
          ],
        ],

    ],
    'params' => $params,
];
