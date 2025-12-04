package com.appdev.vabara.valmerabanicoruperez.filter;

import com.appdev.vabara.valmerabanicoruperez.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Skip filtering for authentication endpoints
        if (request.getRequestURI().startsWith("/api/auth") || request.getRequestURI().startsWith("/api/tutoring-sessions")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = extractTokenFromCookies(request.getCookies());
        
        if (token != null && jwtUtil.validateToken(token, getUsernameFromToken(token))) {
            // Token is valid, continue with the request
            filterChain.doFilter(request, response);
        } else {
            // Token is invalid or missing, return unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
    
    private String extractTokenFromCookies(Cookie[] cookies) {
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "jwt".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        return null;
    }
    
    private String getUsernameFromToken(String token) {
        try {
            return jwtUtil.getUsernameFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }
}