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
class MobileAsset extends AssetBundle
{
    public $basePath = '@app/web/';
    public $baseUrl = '@web';
    public $css = [
        'css/bootstrap/bootstrap.css',
        'css/mobile.css',
        'css/glyphicon.css'
    ];
    public $js = [        
        //'js/bootstrap/tether.min.js',
        'js/bootstrap/bootstrap.js',
        
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\web\JqueryAsset'        
    ];
    
}
