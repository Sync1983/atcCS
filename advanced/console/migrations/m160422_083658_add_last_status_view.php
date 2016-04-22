<?php

use yii\db\Migration;

class m160422_083658_add_last_status_view extends Migration{

 public function up(){
   $SQL = <<<SQL
    CREATE OR REPLACE FUNCTION get_part_last_status(
      OUT id bigint,
      OUT part_id bigint,
      OUT status smallint,
      OUT last_time timestamp without time zone)
    RETURNS SETOF record AS $$
      SELECT  id,
              part_id,
              status,
              max_time
      FROM (
        SELECT  id,
                part_id,
                status,
                max(time) OVER (PARTITION BY part_id) as max_time,
                time as tm
        FROM "Status" s
        ORDER BY s.time desc
      ) as t
      WHERE t.tm = t.max_time $$
      LANGUAGE sql VOLATILE
SQL;
   $this->execute($SQL);

   $SQL = <<<SQL
   CREATE OR REPLACE VIEW LastStatus AS
      SELECT * FROM get_part_last_status();
SQL;
   $this->execute($SQL);
 }

 public function down() {
   $SQL = <<<SQL
       DROP VIEW LastStatus;
SQL;
   $this->execute($SQL);
   $SQL = <<<SQL
       DROP FUNCTION get_part_last_status();
SQL;
   $this->execute($SQL);
   return true;
 }
}