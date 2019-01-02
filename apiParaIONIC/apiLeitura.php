<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
   header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
   header('Access-Control-Allow-Credentials: true');
   header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


   $hn      = 'localhost';
   $un      = 'root';
   $pwd     = '';
   $db      = 'tarefas';
   $cs      = 'utf8';

   $dsn 	= "mysql:host=" . $hn . ";dbname=" . $db . ";charset=" . $cs;
   $opt 	= array(
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        PDO::ATTR_EMULATE_PREPARES   => false,
                       );
   $pdo 	= new PDO($dsn, $un, $pwd, $opt);
   $data    = array();

   try {
      $stmt 	= $pdo->query('SELECT id, nome FROM usuario ORDER BY nome ASC');
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
         //$i = 0;
         $data[] = $row;
         // Retorna um dado em formato JSON
      //$i++;
      }
      //return json_encode($data);

      // Retorna um dado em formato JSON
      echo json_encode($data);
   }
   catch(PDOException $e)
   {
      echo $e->getMessage();
   }
?>