package com.liclam.lexinsurance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom("bogotacup@gmail.com"); 
            email.setTo(to);
            email.setSubject(subject);
            email.setText(content);

            mailSender.send(email);
            System.out.println("Email enviado correctamente a: " + to);
        } catch (Exception e) {
            System.err.println("Error al enviar el email: " + e.getMessage());
        }
    }
}