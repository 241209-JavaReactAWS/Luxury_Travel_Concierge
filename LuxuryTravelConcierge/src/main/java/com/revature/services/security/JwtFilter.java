package com.revature.services.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.revature.services.security.JwtUtil.validateToken;

public class JwtFilter extends UsernamePasswordAuthenticationFilter {

    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean requiresAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            try {
                String username = validateToken(token.substring(7));
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
            } catch (JwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            } catch (UsernameNotFoundException e) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
        }
        return false;
    }
}
