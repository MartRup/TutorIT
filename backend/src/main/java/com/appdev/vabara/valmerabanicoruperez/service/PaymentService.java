package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.PaymentEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Create
    public PaymentEntity addPayment(PaymentEntity payment) {
        return paymentRepository.save(payment);
    }

    // Read - Get by ID
    public PaymentEntity findPaymentById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    // Read - Get all
    public List<PaymentEntity> findAllPayments() {
        return paymentRepository.findAll();
    }

    // Update
    public PaymentEntity updatePayment(String id, PaymentEntity payment) {
        PaymentEntity existingPayment = findPaymentById(id);
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setPaymentStatus(payment.getPaymentStatus());
        existingPayment.setPaymentDate(payment.getPaymentDate());
        return paymentRepository.save(existingPayment);
    }

    // Delete
    public void deletePayment(String id) {
        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }

    // Check if exists
    public boolean existsById(String id) {
        return paymentRepository.existsById(id);
    }
}