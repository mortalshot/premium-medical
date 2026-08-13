<?php
// Настройка отправки
require 'config.php';

//От кого письмо
$mail->setFrom('some@gmail.com', 'Письмо от ЧФ4'); // Укажите нужный E-mail
//Кому отправлять
$mail->addAddress('some@gmail.com'); // Укажите нужный E-mail
//Тема письма
$mail->Subject = 'Приветствие! Это Чертоги Фрилансера 4';

//Тело письма
$body = '<h1>Встречайте супер письмо!</h1>';

//if(trim(!empty($_POST['email']))){
//$body.=$_POST['email'];
//}	

/*
	//Подключить файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//Путь к скачиванию файла
		$filePath = __DIR__ . "/files/sendmail/attachments/" . $_FILES['image']['name']; 
		//Грузим файл
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			$body.='<p><strong>Фото в приложении</strong>';
			$mail->addAttachment($fileAttach);
		}
	}
	*/

$mail->Body = $body;

//Отправляем
if (!$mail->send()) {
	$message = 'Ошибка';
} else {
	$message = 'Данные отправлены!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
