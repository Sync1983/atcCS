<?php

/**
 * @author sync1983
 */
namespace console\controllers\actions\tdload;
use console\controllers\actions\tdload\LoadAction;

class ArticleLoadAction extends LoadAction{

  public function run(){

    $action = $this->id;
    $path   = \yii::getAlias("@load_data_dir");
    $file_name = $path . "/tbl_" . str_replace("Load", "", $action) ."-p*";
    $files  = glob($file_name);

    $sqls   = [];
    //$sqls['clean'] = $this->getCleanCommand("Article");
    $ignore_names = [
            'tbl_article-paa',
            'tbl_article-pab',
            'tbl_article-pac',
            'tbl_article-pad',
            'tbl_article-pae',
            'tbl_article-paf',
            'tbl_article-pag',
            'tbl_article-pah',
            'tbl_article-pai',
    ];

    foreach ($files as $file){
      $name = basename($file);
      if( in_array($name, $ignore_names) ){
        continue;
      }
      $sqls["load: $name"] = $this->getCopyCommand("Article", $file, ",", ['part_id','part_search_number','part_type','part_full_number','brand'],false,'WINDOWS-1251');
    }
    
    echo "Delete Index\r\n";
    $mgr  = new \yii\db\Migration();
    /* @var $db \yii\db\Connection */
    $db = \yii::$app->getDb();

    $db->createCommand('DROP INDEX IF EXISTS by_part_id')->execute();
    $db->createCommand('DROP INDEX IF EXISTS by_part_sn')->execute();
    $db->createCommand('DROP INDEX IF EXISTS by_part_type')->execute();

    $this->executeCommand($sqls);
    
    echo "Create Index\r\n";
    $mgr->createIndex('by_part_id', "Article", 'part_id');
    echo "Create text index on \"part_search_number\"";
    $SQL = 'CREATE INDEX by_part_sn ON "Article" ("part_search_number" text_pattern_ops);';
    $mgr->db->createCommand($SQL)->execute();
    $mgr->createIndex('by_part_type', "Article", 'part_type');
  }

}
