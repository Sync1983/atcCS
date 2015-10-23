<?php

/**
 * @author sync1983
 */

namespace common\models;
use common\models\Redis\RedisSSet;

class FilterTreeItem extends RedisSSet{
  
  public static function prefixKey() {
    return "filter::";
  }

}
