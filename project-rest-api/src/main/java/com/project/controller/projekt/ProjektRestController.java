package com.project.controller.projekt;

import com.project.controller.projekt.requests.JoinCodeRequest;
import com.project.controller.projekt.requests.projektIdRequest;
import com.project.model.Projekt;
import com.project.model.Role;
import com.project.model.Student;
import com.project.model.User;
import com.project.service.ProjektService;
import com.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;


@RestController // przez kontener Springa REST-owy kontroler obsługujący sieciowe żądania
@CrossOrigin
@RequestMapping("/api/v1/projekty") // adnotacja @RequestMapping umieszczona w tym miejscu pozwala definiować
public class ProjektRestController { // cześć wspólną adresu, wstawianą przed wszystkimi poniższymi ścieżkami
    private final ProjektService projektService; //serwis jest automatycznie wstrzykiwany poprzez konstruktor
    private UserService userService;

    @Autowired
    public ProjektRestController(ProjektService projektService, UserService userService) {
        this.projektService = projektService;
        this.userService = userService;
    }

    // PRZED KAŻDĄ Z PONIŻSZYCH METOD JEST UMIESZCZONA ADNOTACJA (@GetMapping, PostMapping, ... ), KTÓRA OKREŚLA
    // RODZAJ METODY HTTP, A TAKŻE ADRES I PARAMETRY ŻĄDANIA
    //Przykład żądania wywołującego metodę: GET http://localhost:8080/api/projekty/1
    @GetMapping("/{projektId}")
    ResponseEntity<Projekt> getProjekt(@PathVariable Long projektId) {// @PathVariable oznacza, że wartość
        return ResponseEntity.of(projektService.getProjekt(projektId)); // parametru przekazywana jest w ścieżce
    }

    //Przykład żądania wywołującego metodę: http://localhost:8080/api/projekty?page=0&size=10&sort=nazwa,desc
    @GetMapping
    Page<Projekt> getProjekty(Pageable pageable) { // @RequestHeader HttpHeaders headers – jeżeli potrzebny
        return projektService.getProjekty(pageable); // byłby nagłówek, wystarczy dodać drugą zmienną z adnotacją
    }

    // Przykład żądania wywołującego metodę: GET http://localhost:8080/api/projekty?nazwa=webowa
    // Metoda zostanie wywołana tylko, gdy w żądaniu będzie przesyłana wartość parametru nazwa.
    @GetMapping(params = "nazwa")
    Page<Projekt> getProjektyByNazwa(@RequestParam String nazwa, Pageable pageable) {
        return projektService.searchByNazwa(nazwa, pageable);
    }

    @PostMapping(value = "/join")
    public void joinProject(@RequestBody JoinCodeRequest request, @AuthenticationPrincipal User currentUser) {
        Optional<Projekt> project = projektService.getProjekt(request.getJoinCode());
        if (project.isPresent()) {
            project.get().getStudents().add(currentUser.getStudent());
            projektService.setProjekt(project.get());
        }
    }

    @PostMapping(value = "/leave")
    public void leaveProject(@RequestBody projektIdRequest request, @AuthenticationPrincipal User currentUser) {
        Optional<Projekt> project = projektService.getProjekt(request.getProjektId());
        if (project.isPresent()) {
            Student student = userService.getUser(currentUser.getEmail()).get().getStudent();
            project.get().getStudents().remove(student);
            projektService.setProjekt(project.get());
        }
    }

    @PreAuthorize("hasAnyRole( 'STUDENT', 'NAUCZYCIEL')")
    @GetMapping("/my")
    public ResponseEntity<Set<Projekt>> getMyProjects(@AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole().equals(Role.STUDENT)) {
            Set<Projekt> projekts = projektService.getProjektyByStudentId(currentUser.getStudent().getStudentId());
            return ResponseEntity.ok(projekts);
        }
        else if (currentUser.getRole().equals(Role.NAUCZYCIEL)) {
            Set<Projekt> projects = projektService.getProjektByTeacherTeacherId(currentUser.getTeacher().getTeacherId());
            return ResponseEntity.ok(projects);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
