package com.project.model;

//import b.Column;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name="projekt") //TODO Indeksować kolumny, które są najczęściej wykorzystywane do wyszukiwania projektów
public class Projekt {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="projekt_id") //tylko jeżeli nazwa kolumny w bazie danych ma być inna od nazwy zmiennej
	private Integer projektId;
	@Column(nullable = false, length = 50)
	private String nazwa;
	@ManyToMany
	@JoinTable(name = "projekt_student",
			joinColumns = {@JoinColumn(name="projekt_id")},
			inverseJoinColumns = {@JoinColumn(name="student_id")})
	private Set<Student> studenci;
	/*TODO Uzupełnij kod o zmienne reprezentujące pozostałe pola tabeli projekt (patrz rys. 3.1),
	. następnie wygeneruj dla nich tzw. akcesory i mutatory (Source -> Generate Getters and Setters),
	. ponadto dodaj pusty konstruktor oraz konstruktor ze zmiennymi nazwa i opis.
	*/
}
