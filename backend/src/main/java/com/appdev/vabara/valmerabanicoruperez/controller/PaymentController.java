package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.PaymentEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public List<PaymentEntity> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentEntity> getPaymentById(@PathVariable("id") String paymentId) {
        Optional<PaymentEntity> payment = paymentRepository.findById(paymentId);
        return payment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PaymentEntity createPayment(@RequestBody PaymentEntity payment) {
        return paymentRepository.save(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentEntity> updatePayment(
            @PathVariable("id") String paymentId,
            @RequestBody PaymentEntity updatedPayment) {
        if (!paymentRepository.existsById(paymentId)) {
            return ResponseEntity.notFound().build();
        }
        updatedPayment.setPaymentId(paymentId);
        PaymentEntity savedPayment = paymentRepository.save(updatedPayment);
        return ResponseEntity.ok(savedPayment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable("id") String paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            return ResponseEntity.notFound().build();
        }
        paymentRepository.deleteById(paymentId);
        return ResponseEntity.noContent().build();
    }
}
