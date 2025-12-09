package com.appdev.vabara.valmerabanicoruperez.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

    // Secret key for signing JWT tokens (in production, this should be stored securely)
    private SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // Token validity: 24 hours
    public static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60;

    // Retrieve username from jwt token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // Retrieve expiration date from jwt token
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    // Retrieve user type from jwt token
    public String getUserTypeFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("userType", String.class));
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // Parse and validate token
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
    }

    // Check if the token has expired
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // Generate token for user
    public String generateToken(String username, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userType", userType);
        return doGenerateToken(claims, username);
    }

    // While creating the token -
    // 1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    // 2. Sign the JWT using the HS512 algorithm and secret key
    // 3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //    compaction of the JWT to a URL-safe string
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(SECRET_KEY)
                .compact();
    }

    // Validate token
    public Boolean validateToken(String token) {
        try {
            getAllClaimsFromToken(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Extract token from request
    public String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        // Also check for token in cookies
        String jwtCookie = extractTokenFromCookies(request);
        if (jwtCookie != null) {
            return jwtCookie;
        }
        
        return null;
    }
    
    // Extract token from cookies
    private String extractTokenFromCookies(HttpServletRequest request) {
        // This is a simplified approach. In a real application, you might want to use 
        // a more robust cookie parsing mechanism.
        String cookieHeader = request.getHeader("Cookie");
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split("; ");
            for (String cookie : cookies) {
                if (cookie.startsWith("jwt=")) {
                    return cookie.substring(4); // Length of "jwt="
                }
            }
        }
        return null;
    }
    
    // Extract email from token
    public String extractEmail(String token) {
        return getUsernameFromToken(token);
    }
    
    // Extract user type from token
    public String extractUserType(String token) {
        return getUserTypeFromToken(token);
    }
}