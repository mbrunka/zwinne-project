package com.project.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity //Indeksujemy kolumny, które są najczęściej wykorzystywane do wyszukiwania studentów
@Table(name = "student",
        indexes = {@Index(name = "idx_nr_indeksu", columnList = "nr_indeksu", unique = true)})
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @JsonManagedReference
    @OneToOne
    @MapsId
    private User user;

    private String nrIndeksu;

    private Boolean stacjonarny;

    @JsonBackReference
    @ManyToMany
    @JoinTable(name = "projekt_student",
            joinColumns = {@JoinColumn(name = "student_id")},
            inverseJoinColumns = {@JoinColumn(name = "projekt_id")})
    private Set<Projekt> projekty;

    @JsonBackReference
    @ManyToMany
    @JoinTable(name = "zadania_student",
            joinColumns = {@JoinColumn(name = "student_id")},
            inverseJoinColumns = {@JoinColumn(name = "zadania_id")})
    private Set<Projekt> zadania;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((nrIndeksu == null) ? 0 : nrIndeksu.hashCode());
        // other fields
        // do not include User in Student's hashCode()
        return result;
    }
}

