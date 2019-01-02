<?php
    require_once('Usuario.class.php');

    //http://stackoverflow.com/questions/18382740/cors-not-working-php
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }

    //http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined
    $postdata = file_get_contents("php://input");
    
    //if (isset($postdata)) {

        $json    =  file_get_contents('php://input');
        $obj     =  json_decode($json);
        $key     =  strip_tags($obj->key);

        $request = json_decode($postdata);
        $usuario = new Usuario;

        $key = strip_tags($obj->key);
        switch($key)
         {
         CASE "cadastrar" :
         $nome = $obj->nome;
         $usuario->cadastrarUsuario($nome);
         break;
         CASE "deletar" :
         $idUsuario =  $obj->IdUsuario;
		 if(is_null($idUsuario)){
			 echo "usuario nulo".$idUsuario;
		 }
		else{
         $usuario->deletarUsuario($idUsuario);
		 }
         break;
         CASE "editar":
         $idUsuario =  $obj->IdUsuario;
         $nome = $obj->nome;
		 if(is_null($idUsuario) || is_null($nome)){
			 echo "Nome ou Id não pode ser nulo".$idUsuario;
		 }
		else{
         $usuario->editarUsuario($idUsuario,$nome);
		}
		 break;
         CASE "listar":
         $usuario->listarUsuario();
         break;
         }
//    }
//    else 
//     {
//         echo "Os parametros estão nulos";
//     }
?>