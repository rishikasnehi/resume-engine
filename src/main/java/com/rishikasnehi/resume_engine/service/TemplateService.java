package com.rishikasnehi.resume_engine.service;

import static com.rishikasnehi.resume_engine.util.AppConstants.PREMIUM;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.rishikasnehi.resume_engine.dto.RegisterResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateService {

    private final AuthService authService;

    public Map<String, Object> getTemplates(Object principalObject) {

        // Step 1 : Get the current profile 
        RegisterResponse response = authService.getProfile(principalObject);

        // Step 2 : Get the available templates based on the subsription plan for the user
        List<String> availableTemplates;
        boolean isPremiumUser = response.getSubscriptionPlan().equalsIgnoreCase(PREMIUM);
        if(isPremiumUser) {
            availableTemplates = List.of("01", "02", "03");
        } else {
            availableTemplates = List.of("01");
        }

        // Step 3 : Add the data into the map
        Map<String, Object> restrictions = new HashMap<>();
        restrictions.put("availableTemplates", availableTemplates);
        restrictions.put("allTemplates", List.of("01", "02", "03"));
        restrictions.put("subscriptionPlan", response.getSubscriptionPlan());
        restrictions.put("isPremiumUser", isPremiumUser);

        // Step 4 : Return the result
        return restrictions;
    }
}
