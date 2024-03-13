package com.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.Set;

@Entity //Indeksujemy kolumny, które są najczęściej wykorzystywane do wyszukiwania studentów
@Table(name = "student",
        indexes = { @Index(name = "idx_nazwisko", columnList = "nazwisko", unique = false),
                @Index(name = "idx_nr_indeksu", columnList = "nr_indeksu", unique = true) })
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotBlank(message = "Pole student_id nie może być puste!")
    @Size(min = 1, max = 50, message = "Nazwa musi zawierać od {min} do {max} znaków!")
    @Column(name="student_id")
    private Integer studentId;
    @NotBlank(message = "Pole imie nie może być puste!")
    @Size(min = 1, max = 50, message = "Nazwa musi zawierać od {min} do {max} znaków!")
    @Column(nullable = false, length = 50)
    private String imie;
    @NotBlank(message = "Pole nazwisko nie może być puste!")
    @Size(min = 1, max = 100, message = "Nazwa musi zawierać od {min} do {max} znaków!")
    @Column(nullable = false, length = 100)
    private String nazwisko;
    @NotBlank(message = "Pole nr_indeksu nie może być puste!")
    @Size(min = 6, max = 20, message = "Nazwa musi zawierać od {min} do {max} znaków!")
    @Column(name = "nr_indeksu", nullable = false, length = 20, unique = true)
    private String nrIndeksu;
    @NotEmpty(message = "Pole email nie może być puste!")
    @Email(message = "Email should be valid")
    @Max(value = 50, message = "Pole email może zawierać maksymalnie {value} znaków!")
    @Column(nullable = false, length = 50, unique = true)
    private String email;
    @NotEmpty(message = "Pole email nie może być puste!")
    @Column(nullable = false)
    private Boolean stacjonarny;
    @ManyToMany(mappedBy = "studenci")
    private Set<Projekt> projekty;
    public Student() {}
    public Student(String imie, String nazwisko, String nrIndeksu, Boolean stacjonarny) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.nrIndeksu = nrIndeksu;
    }
    public Student(String imie, String nazwisko, String nrIndeksu, String email, Boolean stacjonarny) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.nrIndeksu = nrIndeksu;
        this.email = email;
        this.stacjonarny = stacjonarny;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getImie() {
        return imie;
    }

    public void setImie(String imie) {
        this.imie = imie;
    }

    public String getNazwisko() {
        return nazwisko;
    }

    public void setNazwisko(String nazwisko) {
        this.nazwisko = nazwisko;
    }

    public String getNrIndeksu() {
        return nrIndeksu;
    }

    public void setNrIndeksu(String nrIndeksu) {
        this.nrIndeksu = nrIndeksu;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getStacjonarny() {
        return stacjonarny;
    }

    public void setStacjonarny(Boolean stacjonarny) {
        this.stacjonarny = stacjonarny;
    }

    public Set<Projekt> getProjekty() {
        return projekty;
    }

    public void setProjekty(Set<Projekt> projekty) {
        this.projekty = projekty;
    }
//...
}

