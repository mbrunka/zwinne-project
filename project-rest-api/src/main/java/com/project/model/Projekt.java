package com.project.model;

//import b.Column;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder(builderMethodName = "hiddenBuilder") // rename the original builder method
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projekt") //TODO Indeksować kolumny, które są najczęściej wykorzystywane do wyszukiwania projektów
public class Projekt {
    @Id
    @Column(name = "projekt_id") //tylko jeżeli nazwa kolumny w bazie danych ma być inna od nazwy zmiennej
    @GeneratedValue
    private long projektId;

    @OneToMany(mappedBy = "projekt")
    @JsonIgnoreProperties({"projekt"})
    private List<Zadanie> zadania;

    @JsonBackReference
    @ManyToMany
    @JoinTable(name = "projekt_student",
            joinColumns = {@JoinColumn(name = "projekt_id")},
            inverseJoinColumns = {@JoinColumn(name = "student_id")})
    private Set<Student> studenci;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @Column(unique = true)
    private String joinCode;

    @Column(length = 50)
    private String nazwa;

    @Column(length = 1000)
    private String opis;

    // ...
    @CreationTimestamp
    @Column(name = "dataczas_utworzenia", updatable = false)
    private LocalDateTime dataCzasUtworzenia;
    // ...
    @UpdateTimestamp
    @Column(name = "dataczas_modyfikacji")
    private LocalDateTime dataCzasModyfikacji;

    @Column
    private LocalDateTime data_oddania;

    public static String generateJoinCode() {
        return UUID.randomUUID().toString();
    }

    public Projekt(String nazwa, String opis, Teacher teacher) {
        this.nazwa = nazwa;
        this.opis = opis;
        this.teacher = teacher;
        this.joinCode = generateJoinCode();
    }

    public static ProjektBuilder builder() {
        return hiddenBuilder().joinCode(generateJoinCode());
    }

    public Collection<Student> getStudents() {
        return studenci;
    }

    @Override
    public String toString() {
        return "Projekt{" +
                "projektId=" + projektId +
                ", zadania=" + zadania +
                ", studenci=" + studenci +
                ", teacher=" + teacher +
                ", joinCode='" + joinCode + '\'' +
                ", nazwa='" + nazwa + '\'' +
                ", opis='" + opis + '\'' +
                ", dataCzasUtworzenia=" + dataCzasUtworzenia +
                ", dataCzasModyfikacji=" + dataCzasModyfikacji +
                ", data_oddania=" + data_oddania +
                '}';
    }
}
