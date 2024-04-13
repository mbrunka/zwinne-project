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
@Entity
@Table
public class Status {
    @Id
    @GeneratedValue
    private Long statusId;

    private String nazwa;

    //color
    private String kolor;

    //weight
    private Integer waga;

    @JsonBackReference
    @OneToMany(mappedBy = "status")
    private Set<Zadanie> zadania;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "projekt_id")
    private Projekt projekt;

    public Status(String nazwa, String kolor, Integer waga, Projekt projekt) {
        this.nazwa = nazwa;
        this.kolor = kolor;
        this.waga = waga;
        this.projekt = projekt;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((statusId == null) ? 0 : statusId.hashCode());
        // other fields that define equality
        return result;
    }

}
