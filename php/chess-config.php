<?php
date_default_timezone_set('Europe/Berlin');
define("CHESS_FILE_UPLOAD_URL", "/tmp/");

<<<<<<< HEAD
$conn = mysql_connect($chess_db_host,$chess_db_username,$chess_db_password);
if(!$conn){
    die("Unable to connect $chess_db_host,$chess_db_username,$chess_db_password");
}
$db_selected = mysql_select_db($chess_db_database,$conn);;
if (!$db_selected) {
    die ("Can't connect to " . $chess_db_database . " " . mysql_error());
}
=======
>>>>>>> 4eba1d1b755b4b83f9fbbdeba9b8c62623d5728d



