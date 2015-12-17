<?php

/**
 * @author sync1983
 */

namespace console\controllers;
use yii\console\Controller;

class TdMigrateController extends Controller{

  public function actions() {
    return [
      'show-tables'   => actions\tdmigrate\ShowTablesAction::className(),
      'article'       => actions\tdmigrate\ArticleAction::className(),
      'suppliers'     => actions\tdmigrate\SuppliersAction::className(),
      'brands'        => actions\tdmigrate\BrandsAction::className(),
      'description'   => actions\tdmigrate\DescriptionAction::className(),
      'article-info'  => actions\tdmigrate\ArticleInfoAction::className(),
      'manufacturers' => actions\tdmigrate\ManufacturersAction::className(),
      'models'        => actions\tdmigrate\ModelsAction::className(),
      'types'         => actions\tdmigrate\TypesAction::className(),
      'links'         => actions\tdmigrate\LinksAction::className(),
      'links-art'     => actions\tdmigrate\LinksArtAction::className(),
      'texts'         => actions\tdmigrate\TextsAction::className(),
      'graphics-data' => actions\tdmigrate\GraphicsDataAction::className(),
      'gen-art'       => actions\tdmigrate\GenArtAction::className(),
      'search-tree'   => actions\tdmigrate\SearchTreeAction::className(),
      'str-lookup'    => actions\tdmigrate\StrLookupAction::className()
    ];
  }

}
