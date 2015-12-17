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
      'article'       => actions\tdmigrate\ArticleAction::className(),      
      'article-info'  => actions\tdmigrate\ArticleInfoAction::className(),
      'links'         => actions\tdmigrate\LinksAction::className(),
      'links-art'     => actions\tdmigrate\LinksArtAction::className(),
      'graphics-data' => actions\tdmigrate\GraphicsDataAction::className(),
      'gen-art'       => actions\tdmigrate\GenArtAction::className(),
      'search-tree'   => actions\tdmigrate\SearchTreeAction::className(),
      'str-lookup'    => actions\tdmigrate\StrLookupAction::className()*/
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
