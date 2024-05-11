package com.project.controller.projekt.zadanie.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import com.project.model.Zadanie;
import com.project.model.Student;

public class ZadanieSpecification implements Specification<Zadanie> {

    private final Long projektId;
    private final String nazwa;
    private final String opis;
    private final Long studentId;

    public ZadanieSpecification(Long projektId, String nazwa, String opis, Long studentId) {
        this.projektId = projektId;
        this.nazwa = nazwa;
        this.opis = opis;
        this.studentId = studentId;
    }

    @Override
    public Predicate toPredicate(Root<Zadanie> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = criteriaBuilder.conjunction();

        if (projektId != null) {
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("projekt").get("projektId"), projektId));
        }

        if (nazwa != null) {
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get("nazwa"), "%" + nazwa + "%"));
        }

        if (opis != null) {
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get("opis"), "%" + opis + "%"));
        }

        if (studentId != null) {
            Join<Zadanie, Student> studentJoin = root.join("studenci");
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(studentJoin.get("id"), studentId));
        }

        return predicate;
    }
}