package com.liclam.lexinsurance.repository;

import com.liclam.lexinsurance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByCedula(String cedula);
    Optional<User> findByPhoneNumber(String phoneNumber);
}