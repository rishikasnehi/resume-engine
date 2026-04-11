package com.rishikasnehi.resume_engine.service;

import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.rishikasnehi.resume_engine.dto.RegisterResponse;
import com.rishikasnehi.resume_engine.model.Payment;
import com.rishikasnehi.resume_engine.model.User;
import com.rishikasnehi.resume_engine.repository.PaymentRepository;
import com.rishikasnehi.resume_engine.repository.UserRepository;

import static com.rishikasnehi.resume_engine.util.AppConstants.PREMIUM;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AuthService authService;
    private final UserRepository userRepository;


    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public Payment createOrder(Object principalObject, String planType) throws RazorpayException{

        // Step 1 : Get the current user details from the principal object
        RegisterResponse registerResponse = authService.getProfile(principalObject);

        // Step 2 : Initialize Razorpay client 
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Step 3 : Prepare the json object to pass the razorpay
        int amount = 99900; // amount in paise
        String currency = "INR";
        String receipt = PREMIUM + "_" + UUID.randomUUID().toString().substring(0, 8); // generate a unique receipt id

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);

        // Step 4 : call the razorpay api to create the order
        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        // Step 5 : Save the payment details in the database    
        Payment newPayment = Payment.builder()
            .userId(registerResponse.getId())
            .razorpayOrderId(razorpayOrder.get("id"))
            .amount(amount)
            .currency(currency)
            .planType(planType)
            .receipt(receipt)
            .status("created")
            .build();
        return paymentRepository.save(newPayment);

        // Step 6 : return the result
    }

    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws RazorpayException{

        try {
            JSONObject attributes  = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);   
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isValidSignature = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if(isValidSignature) {
                Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElseThrow(() -> new RuntimeException("Payment not found"));
                payment.setRazorpaySignature(razorpaySignature);
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setStatus("paid");
                paymentRepository.save(payment);

                
                // Upgrade the user subscription status if payment is successful
                upgradeUserSubscription(payment.getUserId(), payment.getPlanType());
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Payment verification failed for order id: {} and payment id: {}. Error: {}", razorpayOrderId, razorpayPaymentId, e.getMessage());
            return false;
        }
    }

    private void upgradeUserSubscription(String userId, String planType) {
    User existingUser = userRepository.findById(userId)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        existingUser.setSubscriptionPlan(planType);
        userRepository.save(existingUser);
        log.info("User subscription upgraded to {} for user id: {}", planType, userId);    
    }

    public List<Payment> getPaymentHistory(Object principalObject) {

        // Step 1 : Get the current user details from the principal object
        RegisterResponse registerResponse = authService.getProfile(principalObject);

        // Step 2 : Call the repository method to fetch payment history for the user
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(registerResponse.getId());
    }

    public Payment getPaymentDetails(String razorpayOrderId) {
        // Step 1 : Call the repository method to fetch payment details by razorpay order id
        return paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

}
