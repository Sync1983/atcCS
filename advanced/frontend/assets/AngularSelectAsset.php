<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace frontend\assets;

use yii\web\AssetBundle;
use frontend\assets\AngularAsset;
use yii\web\View;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AngularSelectAsset extends AssetBundle
{
    public $sourcePath = '@bower/angular-ui-select/dist';    
    public $css = [        
        'select.css',
    ];
    public $js = [
        'select.min.js',
    ];
    public $depends = [      
      AngularAsset::class
    ];
}
