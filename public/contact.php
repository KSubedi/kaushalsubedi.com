<?php>

$to = "kaushal@wireshock.com";

if(isset($_POST['email']) && isset($_POST['name']) && isset($_POST['message'])){
    $email = $_POST['email'];
    $name = $_POST['name'];
    $message = $_POST['message'];

    if($email === "" || $name === "" || $message === ""){
        header('Location: /error/contact-form-fields');
    }else{
        $subject = "Contact From " . $name . ' (' . $email . ')';

        $headers = "From: contact@kaushalsubedi.com\r\n".
        'Reply-To: '.$email."\r\n" .
        'X-Mailer: PHP/' . phpversion();
        @mail($to, $subject, $message, $headers);
        header('Location: /message/contact');
    }
}else{
    header('Location: /error/contact-form-fields');
}

?>
