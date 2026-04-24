package com.rishikasnehi.resume_engine.controller;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.RazorpayException;
import com.rishikasnehi.resume_engine.model.Payment;
import com.rishikasnehi.resume_engine.service.PaymentService;
import static com.rishikasnehi.resume_engine.util.AppConstants.PREMIUM;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")   
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request, Authentication authentication) throws RazorpayException{

        // Step 1 : validate the request
        String planType = request.get("planType");
        if(!PREMIUM.equalsIgnoreCase(planType)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid plan type"));
        }

        // Step 2 : call the service method
        Payment payment = paymentService.createOrder(authentication.getPrincipal(), planType);

        // Step 3 : prepare the response object
        Map<String, Object> response = Map.of(
            "orderId", payment.getRazorpayOrderId(),
            "amount", payment.getAmount(),
            "currency", payment.getCurrency(),
            "receipt", payment.getReceipt()
        );

        // Step 4 : return the response
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) throws RazorpayException{

        // Step 1 : Validate the request
        String razorpayOrderId = request.get("razorpay_order_id");
        String razorpayPaymentId = request.get("razorpay_payment_id");
        String razorpaySignature = request.get("razorpay_signature");

        if(Objects.isNull(razorpayOrderId) || Objects.isNull(razorpayPaymentId) || Objects.isNull(razorpaySignature)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required payment parameters"));
        }

        // Step 2 : Call the service method to verify the payment
        boolean isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        // Step 3 : Return the response
        if(isValid) {
            return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "status", "success"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid payment details", "status", "failure"));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(Authentication authentication) {

        // Step 1 : call the service method to get payment history for the current user
        List<Payment> paymentHistory = paymentService.getPaymentHistory(authentication.getPrincipal());

        // Step 2: return the response
        return ResponseEntity.ok(paymentHistory);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {

        // Step 1 : call the service method to get payment details by razorpay order id
        Payment paymentDetails = paymentService.getPaymentDetails(orderId);

        // Step 2 : return the response
        return ResponseEntity.ok(paymentDetails);
    }
}
