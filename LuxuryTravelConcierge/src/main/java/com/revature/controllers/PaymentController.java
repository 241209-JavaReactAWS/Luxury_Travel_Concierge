package com.revature.controllers;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    public PaymentController() {
        Stripe.apiKey = "sk_test_4eC39HqLyjWDarjtT1zdp7dc";
    }

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> paymentRequest) {
        try {
            long amount = Long.parseLong(paymentRequest.get("amount").toString()); // Amount in cents

            // Create PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("usd")
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }

}
