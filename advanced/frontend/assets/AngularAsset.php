<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace frontend\assets;

use yii\web\AssetBundle;
use frontend\assets\AppAsset;
use yii\web\View;

class AngularAsset extends AssetBundle
{
    public $sourcePath = '@bower';
    public $jsOptions = ['position' => View::POS_END];
    public $css = [        
        'angular/angular-csp.css',        
        'angular-ui-switch/angular-ui-switch.css',
        'ng-table/dist/ng-table.min.css'
    ];
    public $js = [
        'angular/angular.min.js',
        'angular-sanitize/angular-sanitize.min.js',        
        'angular-ui-switch/angular-ui-switch.min.js',
        'angular-cookies/angular-cookies.min.js',
        'angular-route/angular-route.js',
        'ng-table/dist/ng-table.js'

    ];
    public $depends = [      
    ];
}
