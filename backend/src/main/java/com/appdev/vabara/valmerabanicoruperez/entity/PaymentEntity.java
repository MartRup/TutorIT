package com.appdev.vabara.valmerabanicoruperez.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payment")
public class PaymentEntity {

    @Id
    @Column(name = "payment_id", nullable = false, length = 36)
    private String paymentId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    public PaymentEntity() {
    }

    public PaymentEntity(String paymentId, BigDecimal amount, String paymentStatus, LocalDate paymentDate) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
}
