<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class TypesLoadAction extends LoadAction{

  public function run(){
    $file = $this->getFileName();
    /*
     * 'TYP_ID'
     * 'TYP_MOD_ID'
     * 'TYP_KW_FROM'
     * 'TYP_HP_FROM'
     * 'TYP_LITRES'
     * 'TYP_CYLINDERS'
     * 'TYP_VALVES'
     * 'CDS_TEX_ID'
     * 'TYP_KV_FUEL_DES_ID'
     * 'TYP_KV_DRIVE_DES_ID'
     * 'TYP_KV_STEERING_SIDE_DES_ID'
     * start
     * end
     */

    $sqls = $this->makeCopyRequest("Types",$file,",",
              [
                'type_id',
                'model_id',
                'kw',
                'hp',
                'volume',
                'cylinder',
                'valves',
                'text_id',
                'fuel_id',
                'drive_id',
                'side_id',
                'start',
                '"end"'
                      ]);
    $this->executeCommand($sqls);    
  }

}
