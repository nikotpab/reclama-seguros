package com.liclam.lexinsurance.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Filtro de seguridad para prevenir ataques de fuerza bruta y DDoS.
 * Limita el número de peticiones por IP.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = request.getRemoteAddr();

        // Limpiar registros antiguos (simple cleanup)
        long textParams = System.currentTimeMillis();
        requestCounts.entrySet().removeIf(entry -> textParams - entry.getValue().timestamp > 60000);

        RequestCounter counter = requestCounts.computeIfAbsent(clientIp,
                k -> new RequestCounter(System.currentTimeMillis()));

        if (System.currentTimeMillis() - counter.timestamp > 60000) {
            // Reset window
            counter.timestamp = System.currentTimeMillis();
            counter.count.set(0);
        }

        if (counter.count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again later.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private static class RequestCounter {
        long timestamp;
        AtomicInteger count = new AtomicInteger(0);

        public RequestCounter(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
