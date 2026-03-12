package com.liclam.lexinsurance.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@Service
public class CryptoService {

    @Value("${app.security.secret-key}")
    private String secretKey;

    public String encrypt(String data) {
        try {
            if (data == null) return null;
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encrypted = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String decrypt(String encryptedData) {
        try {
            if (encryptedData == null) return null;
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decoded = Base64.getDecoder().decode(encryptedData);
            return new String(cipher.doFinal(decoded));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] encryptBytes(byte[] data) {
        try {
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return cipher.doFinal(data);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] decryptBytes(byte[] data) {
        try {
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, key);
            return cipher.doFinal(data);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] compress(byte[] data) {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
             GZIPOutputStream gzip = new GZIPOutputStream(bos)) {
            gzip.write(data);
            gzip.finish();
            return bos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] decompress(byte[] compressedData) {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(compressedData);
             GZIPInputStream gzip = new GZIPInputStream(bis);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int len;
            while ((len = gzip.read(buffer)) > 0) {
                bos.write(buffer, 0, len);
            }
            return bos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}