package com.liclam.lexinsurance.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.liclam.lexinsurance.dto.LoginRequest;
import com.liclam.lexinsurance.dto.RegisterRequest;
import com.liclam.lexinsurance.entity.User;
import com.liclam.lexinsurance.repository.UserRepository;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailService emailService;

    
    private Map<String, RegisterRequest> pendingUsers = new ConcurrentHashMap<>();
    private Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    
    public void registerInitial(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        if (userRepo.findByCedula(req.getCedula()).isPresent()) {
            throw new RuntimeException("La cédula ya está registrada");
        }
        if (userRepo.findByPhoneNumber(req.getPhone()).isPresent()) {
            throw new RuntimeException("El teléfono ya está registrado");
        }
        
        String code = generateCode();
        pendingUsers.put(req.getEmail(), req);
        verificationCodes.put(req.getEmail(), code);
       emailService.sendEmail(req.getEmail(), 
    "Código de verificación: " + code + " - Acceso Reclama Seguros", 
    "Hola,\n\n" +
    "Hemos recibido una solicitud de registro en Reclama Seguros.\n\n" +
    "Para continuar, utiliza el siguiente código de seguridad:\n\n" +
    code + "\n\n" +
    "Este código expirará en 10 minutos.\n\n" +
    "Si tú no has intentado ingresar, por favor ignora este mensaje.\n\n" +
    "Atentamente,\n" +
    "Equipo de Reclama Seguros"
);
    }

    
    public void verifyAndSave(String email, String code) {
        String savedCode = verificationCodes.get(email);
        
        if (savedCode == null || !savedCode.equals(code)) {
            throw new RuntimeException("Código incorrecto o expirado");
        }

        RegisterRequest req = pendingUsers.get(email);
        if (req == null) throw new RuntimeException("Datos de registro no encontrados");

        User user = new User();
        user.setName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhone());
        user.setCedula(req.getCedula()); 
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        
        userRepo.save(user); 

        
        pendingUsers.remove(email);
        verificationCodes.remove(email);
    }

    
    public void initiatePasswordRecovery(String email) {
        if (userRepo.findByEmail(email).isEmpty()) {
            throw new RuntimeException("Correo no registrado");
        }

        String code = generateCode();
        verificationCodes.put(email, code); 

        emailService.sendEmail(email, "Recuperación de Contraseña", 
            "Usa este código para cambiar tu contraseña: " + code);
    }

    
    public void resetPassword(String email, String code, String newPassword) {
        String savedCode = verificationCodes.get(email);
        
        if (savedCode == null || !savedCode.equals(code)) {
            throw new RuntimeException("Código incorrecto");
        }

        User user = userRepo.findByEmail(email).get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        
        verificationCodes.remove(email);
    }

    public User login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return user;
    }

    private String generateCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}