<?php
	require_once("conexao.class.php");

	class Usuario extends Conexao{

		private $nome;

		public function getNome(){
			return $this->nome;
		}
		public function setNome($nome){
			$this->nome = $nome;
    }
    
    public function cadastrarUsuario($nome){
      try{
          $pdo = parent::getDB();
          $query = $pdo->prepare("select * from usuario where nome = ?");
          $query->bindValue(1, $nome);	
          $query->execute();
        
            if($query->rowCount() >= 1)
              {
              echo "Usuario já existe!";
              }
              else
                {
                $stmt2 = $pdo->prepare("INSERT INTO usuario(nome) VALUES(?)");
                $stmt2->bindValue(1, $nome);
                $stmt2->execute();
                echo "Usuário ".$nome." inserido com sucesso";
                } 
          }//fim do try
                catch(PDOException $e)
                {
                echo $e->getMessage();
                }
        }

		public function deletarUsuario($idUsuario)
       {
        try
        {
          $pdo = parent::getDB();
          $query = $pdo->prepare("DELETE FROM Usuario WHERE id = ?");
          $query->bindParam(1, $idUsuario);
          $query->execute();

          echo ('Usuário excluído com sucesso');
        }
          catch(PDOException $e)
          {
              echo $e->getMessage();
          }
       }
    
       public function editarUsuario($idUsuario,$nome)
       {
        try
        {
          $pdo = parent::getDB();
          $query = $pdo->prepare("UPDATE Usuario SET nome = ? WHERE id = ?");
          $query->bindParam(1, $nome);
          $query->bindParam(2, $idUsuario);
          $query->execute();

          echo ('Usuário editado com sucesso');
        }
          catch(PDOException $e)
          {
              echo $e->getMessage();
          }
       }

      public function listarUsuario()
      {
          try 
          {
            $data = array();
            $pdo = parent::getDB();
            $query = $pdo->prepare("SELECT id, nome FROM Usuario ORDER BY nome ASC");
              while($row  = $query->fetch(PDO::FETCH_OBJ))
              {
                $data[] = $row;
              }
              echo json_encode($data);
          }
            catch(PDOException $e)
            {
                echo $e->getMessage();
            }
      }

      //   public function logar(){
      //       $pdo = parent::getDB();
            
      //       /*faço meu select com o banco de dados já criado*/
      //       $logar = $pdo->prepare ("SELECT * FROM usuario WHERE login = ? AND senha = ?");
      //       $logar->bindValue(1, $this->getLogin());
      //       $logar->bindValue(2, $this->getSenha());
      //       $logar->execute();
      //       if ($logar->rowCount()== 1):
      //           $dados = $logar->fetch(PDO::FETCH_OBJ);
                
      //           /*neste ponto informo a tabela que contem o dados do usuário*/
      //           $_SESSION['usuario'] = $dados->nome;
      //           $_SESSION['id_usuario'] = $dados->id_usuario;
      //           /*Aqui informo se o mesmo se encontra logado*/
      //           $_SESSION['logado'] = true;


      //           return true;
      //       else:
      //           return false;
      //       endif;
      //   }


      //   public static function deslogar(){
      //       if(isset($_SESSION['logado']))
			// {
      //           unset($_SESSION['logado']);
      //           session_destroy();
      //           header("http://localhost/oracao/index.php");
			// }
      //   }
		
		
		// public function cadastrarUsuario($email,$nome,$senha,$login)
		// {
		// 	$pdo = parent::getDB();
                      
    //         /*faço meu select com o banco de dados já criado*/
    //         $duplicidadeLogin = $pdo->prepare ("SELECT * FROM usuario WHERE login = ?");
    //         $duplicidadeLogin->bindValue(1, $login);
    //         $duplicidadeLogin->execute();
    //         if ($duplicidadeLogin->rowCount()>= 1)
		// 	{              
		// 		echo "<div class='container'><div class='alert alert-danger' role='alert'>
		// 				Usuário já existe!
		// 			  </div></div>";
           
		// 	}
    //  		  else  /*faço insert no banco*/
		//   {
		// 	$inserir = $pdo->prepare("insert usuario(nome,login,email,senha) values(?,?,?,?)");
    //         $inserir->bindValue(1, $nome);
    //         $inserir->bindValue(2, $login);
		// 	$inserir->bindValue(3, $email);
    //         $inserir->bindValue(4, $senha);
    //         $inserir->execute();
		// 	echo "<div class='container'>
		// 			<div class='alert alert-success' role='alert'>
		// 				Usuário cadastrado com sucesso!
		// 			</div>
		// 		</div>";
		//   }		
		// }
		
    }
?>