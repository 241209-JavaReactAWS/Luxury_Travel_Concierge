package com.revature.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        javaMailSender.send(message);
    }

    public void sendBookingConfirmationEmail(String toEmail, int roomName, String checkInDate, String checkOutDate, int price) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("cy8wolf@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Booking Confirmation");
        message.setText("Your booking for roomID: " + roomName + " has been confirmed. \n" +
                "Check-in Date: " + checkInDate + "\n" +
                "Check-out Date: " + checkOutDate + "\n" +
                "Price: $" + price + "\n" +
                "Thank you for booking with Luxury Travel Concierge!");

        javaMailSender.send(message);
    }
}
