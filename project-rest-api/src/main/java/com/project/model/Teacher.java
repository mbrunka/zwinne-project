package com.project.model;

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
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;

    @JsonManagedReference
    @OneToOne
    @MapsId
    private User user;

    @OneToMany(mappedBy = "teacher")
    private Set<Projekt> projekty;

    @Override
    public String toString() {
        return "Teacher{" +
                "teacherId=" + teacherId +
                ", user=" + user +
                '}';
    }

}
