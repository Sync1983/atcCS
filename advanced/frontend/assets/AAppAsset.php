<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace frontend\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AAppAsset extends AssetBundle
{
    public $sourcePath = '@app/web/js/aapp/';
    public $baseUrl = '@web';
    public $css = [        
    ];
    public $js = [        
        'model.js',
        'app.js',
        'config.js',
        'directive.js',
        'controller.js',
        
    ];
    public $depends = [
        'frontend\assets\AngularAsset'
    ];
    
}
