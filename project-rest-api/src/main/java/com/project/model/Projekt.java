package com.project.model;

//import b.Column;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "projekt") //TODO Indeksować kolumny, które są najczęściej wykorzystywane do wyszukiwania projektów
public class Projekt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "projekt_id") //tylko jeżeli nazwa kolumny w bazie danych ma być inna od nazwy zmiennej
    private Integer projektId;

    @OneToMany(mappedBy = "projekt")
    @JsonIgnoreProperties({"projekt"})
    private List<Zadanie> zadania;

    @ManyToMany
    @JoinTable(name = "projekt_student",
            joinColumns = {@JoinColumn(name = "projekt_id")},
            inverseJoinColumns = {@JoinColumn(name = "student_id")})
    private Set<Student> studenci;

    @Column(nullable = false, length = 50)
    private String nazwa;

    @Column(length = 1000)
    private String opis;

    // ...
    @CreationTimestamp
    @Column(name = "dataczas_utworzenia", nullable = false, updatable = false)
    private LocalDateTime dataCzasUtworzenia;
    // ...
    @UpdateTimestamp
    @Column(name = "dataczas_modyfikacji", nullable = false)
    private LocalDateTime dataCzasModyfikacji;

    @Column
    private LocalDateTime data_oddania;

    // --------------------------------------------
    // Konstruktory
    public Projekt() {
    }

    public Projekt(String nazwa, String opis) {
        this.nazwa = nazwa;
        this.opis = opis;
    }

    // --------------------------------------------
    // Gettery i Settery

    public Integer getProjektId() {
        return projektId;
    }

    public void setProjektId(Integer projektId) {
        this.projektId = projektId;
    }

    public String getNazwa() {
        return nazwa;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public Set<Student> getStudenci() {
        return studenci;
    }

    public void setStudenci(Set<Student> studenci) {
        this.studenci = studenci;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public LocalDateTime getDataCzasUtworzenia() {
        return dataCzasUtworzenia;
    }

    public void setDataCzasUtworzenia(LocalDateTime dataCzasUtworzenia) {
        this.dataCzasUtworzenia = dataCzasUtworzenia;
    }

    public LocalDateTime getDataCzasModyfikacji() {
        return dataCzasModyfikacji;
    }

    public void setDataCzasModyfikacji(LocalDateTime dataCzasModyfikacji) {
        this.dataCzasModyfikacji = dataCzasModyfikacji;
    }

    public LocalDateTime getData_oddania() {
        return data_oddania;
    }

    public void setData_oddania(LocalDateTime data_oddania) {
        this.data_oddania = data_oddania;
    }

    public List<Zadanie> getZadania() {
        return zadania;
    }

    public void setZadania(List<Zadanie> zadania) {
        this.zadania = zadania;
    }
}
