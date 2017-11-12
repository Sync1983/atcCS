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
class MAppAsset extends AssetBundle
{
    public $sourcePath = '@app/web/js/';
    public $baseUrl = '@web';
    public $css = [        
    ];
    public $js = [
        '_mapp.js'        
    ];
    public $depends = [
        'frontend\assets\AngularAsset'
    ];
    
}
