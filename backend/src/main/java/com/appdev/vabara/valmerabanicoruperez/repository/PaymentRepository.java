package com.appdev.vabara.valmerabanicoruperez.repository;

import com.appdev.vabara.valmerabanicoruperez.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, String> {
}
