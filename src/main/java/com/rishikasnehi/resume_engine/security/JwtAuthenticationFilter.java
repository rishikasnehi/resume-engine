package com.rishikasnehi.resume_engine.security;

import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.rishikasnehi.resume_engine.repository.UserRepository;
import com.rishikasnehi.resume_engine.util.Jwtutil;
import com.rishikasnehi.resume_engine.model.User;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final Jwtutil jwtutil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws java.io.IOException, ServletException {
                String authHeader = request.getHeader("Authorization");
                String token = null;
                String userId = null;

                if(authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                    try {
                        userId = jwtutil.getUserIdFromToken(token);
                    } catch (Exception e) {
                        // Invalid token
                        log.error("Invalid JWT token: {}", e.getMessage());
                    }
                }

                if(userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    try {
                        if(jwtutil.validateToken(token) && !jwtutil.isTokenExpired(token)) {
                            User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }

                    } catch (Exception e) {
                        log.error("Error setting authentication: {}", e.getMessage());
                    }

                }

                filterChain.doFilter(request, response);
            }

}
