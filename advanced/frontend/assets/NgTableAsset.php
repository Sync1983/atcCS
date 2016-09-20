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

class NgTableAsset extends AssetBundle
{
    public $sourcePath = '@sync';
    
    public $jsOptions = ['position' => View::POS_END];
    public $publishOptions = [      
      'only' => ['ng-table/dist/*'],
      'forceCopy'  => false
    ];
    
    public $css = [                
        'ng-table/dist/ng-table.min.css'
    ];
    public $js = [        
        'ng-table/dist/ng-table.min.js'

    ];
    public $depends = [
            'frontend\assets\AngularAsset'
    ];
}
