package com.project.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="zadanie")
public class Zadanie {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="zadanie_id")
	private Integer zadanieId;

	/*TODO Uzupełnij kod o zmienne reprezentujące pozostałe pola tabeli zadanie (patrz rys. 3.1),
	. następnie wygeneruj dla nich akcesory i mutatory (Source -> Generate Getters and Setters),
	. ponadto dodaj pusty konstruktor oraz konstruktor ze zmiennymi nazwa, opis i kolejnosc.
	*/
}
