<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;

class TdLoadController extends Controller{

  public function actions() {
    return [
      /*'show-tables'   => actions\tdmigrate\ShowTablesAction::className(),
      'links'         => actions\tdmigrate\LinksAction::className(),
      'links-art'     => actions\tdmigrate\LinksArtAction::className(),      
      'gen-art'       => actions\tdmigrate\GenArtAction::className(),
      'search-tree'   => actions\tdmigrate\SearchTreeAction::className(),
      'str-lookup'    => actions\tdmigrate\StrLookupAction::className()*/
      'article'       => actions\tdload\ArticleLoadAction::className(),
      'article-info'  => actions\tdload\ArticleInfoLoadAction::className(),
      'suppliers'     => actions\tdload\SuppliersLoadAction::className(),
      'brands'        => actions\tdload\BrandsLoadAction::className(),
      'description'   => actions\tdload\DescriptionLoadAction::className(),
      'manufacturers' => actions\tdload\ManufacturersLoadAction::className(),
      'models'        => actions\tdload\ModelsLoadAction::className(),
      'types'         => actions\tdload\TypesLoadAction::className(),
      'texts'         => actions\tdload\TextsLoadAction::className(),
    ];
  }

}
