package com.project.controller.projekt.zadanie;

import com.project.auth.AuthenticationService;
import com.project.controller.projekt.zadanie.requests.ChangeZadanieStatusRequest;
import com.project.controller.projekt.zadanie.requests.SetZadanieRequest;
import com.project.model.*;
import com.project.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController // przez kontener Springa REST-owy kontroler obsługujący sieciowe żądania
@CrossOrigin
@RequestMapping("/api/v1/projekty/")
public class ZadanieRestController {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final ProjektService projektService;
    private final ZadanieService zadanieService;
    private final StatusService statusService;
    private final StudentService studentService;
    private final UserService userService;

    @Autowired
    public ZadanieRestController(ProjektService projektService, ZadanieService zadanieService, StatusService statusService, StudentService studentService, UserService userService) {
        this.projektService = projektService;
        this.zadanieService = zadanieService;
        this.statusService = statusService;
        this.studentService = studentService;
        this.userService = userService;
    }

    @GetMapping("/{projektId}/tasks")
    public ResponseEntity<Page<Zadanie>> getZadania(@PathVariable Long projektId,
                                                    @RequestParam(required = false) String nazwa,
                                                    @RequestParam(required = false) String opis,
                                                    @RequestParam(required = false) Long studentId,
                                                    Pageable pageable) {
        Page<Zadanie> zadania = zadanieService.getZadaniaByProjektIdAndFilters(projektId, nazwa, opis, studentId, pageable);
        return ResponseEntity.ok(zadania);
    }



    @GetMapping("/task/{zadanieId}")
    public ResponseEntity<?> getZadanie(@PathVariable Long zadanieId) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(zadanieId);
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        return ResponseEntity.ok(zadanie.get());
    }

    @PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
    @PostMapping("/task")
    public ResponseEntity<?> createZadanie(@RequestBody SetZadanieRequest request) {
        Projekt projekt = projektService.getProjekt(request.getProjektId()).orElseThrow();
        Optional<Status> targetStatus = statusService.getStatus(request.getStatusId());
        if (targetStatus.isEmpty()) {
            return ResponseEntity.badRequest().body("Status not found");
        }
        Zadanie zadanie = Zadanie.builder()
                .nazwa(request.getNazwa())
                .opis(request.getOpis())
                .status(targetStatus.get())
                .piorytet(request.getPiorytet())
                .projekt(projekt)
                .build();
        Zadanie createdZadanie = zadanieService.setZadanie(zadanie);
        return ResponseEntity.ok(createdZadanie);
    }

    @PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
    @PatchMapping("/task/{zadanieId}")
    public ResponseEntity<?> updateZadanie(@PathVariable Long zadanieId, @RequestBody SetZadanieRequest request) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(zadanieId);
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        Optional<Status> targetStatus = statusService.getStatus(request.getStatusId());
        if (targetStatus.isEmpty()) {
            return ResponseEntity.badRequest().body("Status not found");
        }
        Set<Student> students = null;
//        logger.info("studenci"+request.getStudentIds().toString());
        if (request.getStudentIds() != null) {
            students = studentService.getStudentsByIds(request.getStudentIds()); // Fetch students from database only if studentIds is not null
        }
        zadanie.get().setNazwa(request.getNazwa());
        zadanie.get().setOpis(request.getOpis());
        zadanie.get().setStatus(targetStatus.get());
        zadanie.get().setPiorytet(request.getPiorytet());
        if (students != null) {
            zadanie.get().setStudenci(students);
        }
        Zadanie updatedZadanie = zadanieService.setZadanie(zadanie.get());
        return ResponseEntity.ok(updatedZadanie);
    }

    @PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN', 'STUDENT')")
    @PatchMapping("/task/status")
    public ResponseEntity<?> updateZadanieStatus(@RequestBody ChangeZadanieStatusRequest request,
                                                 @AuthenticationPrincipal User currentUser) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(request.getZadanieId());
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        Projekt projekt = zadanie.get().getProjekt();
        if (currentUser.getRole().equals(Role.NAUCZYCIEL)) {
            //TODO utworzyłam nauczycielem projekt, a potem nie mogłam zmieniąc ststusów zadań
//            if (projekt.getTeacher() != currentUser.getTeacher()) {
//                return ResponseEntity.badRequest().body("You are not allowed to change status of this task");
//            }
        }
        if (currentUser.getRole().equals(Role.STUDENT)) {
            //TODO utworzyłam nauczycielem projekt, a potem nie mogłam zmieniąc ststusów zadań
//            if (projekt.getTeacher() != currentUser.getTeacher()) {
//                return ResponseEntity.badRequest().body("You are not allowed to change status of this task");
//            }
        }
        Optional<Status> targetStatus = statusService.getStatus(request.getStatusId());
        if (targetStatus.isEmpty()) {
            return ResponseEntity.badRequest().body("Status not found");
        }
        zadanie.get().setStatus(targetStatus.get());
        Zadanie updatedZadanie = zadanieService.setZadanie(zadanie.get());
        return ResponseEntity.ok(updatedZadanie);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/task/{zadanieId}/join")
    public ResponseEntity<?> joinZadanie(@PathVariable Long zadanieId, @AuthenticationPrincipal User currentUser) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(zadanieId);
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        zadanie.get().getStudenci().add(currentUser.getStudent());
        zadanieService.setZadanie(zadanie.get());
        return ResponseEntity.ok().build();
    }

    //TODO odpisywanie się nie działa. Dostaję 200, ale nic się nie zmienia
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/task/{zadanieId}/leave")
    public ResponseEntity<?> leaveZadanie(@PathVariable Long zadanieId, @AuthenticationPrincipal User currentUser) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(zadanieId);
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        Student student = userService.getUser(currentUser.getEmail()).get().getStudent();
        zadanie.get().getStudenci().remove(student);
        zadanieService.setZadanie(zadanie.get());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
    @DeleteMapping("/task/{zadanieId}")
    public ResponseEntity<?> deleteZadanie(@PathVariable Long zadanieId) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(zadanieId);
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }

        // Unassign all students from the zadanie
        zadanie.get().getStudenci().clear();
        zadanieService.setZadanie(zadanie.get());

        zadanieService.deleteZadanie(zadanieId);
        return ResponseEntity.ok().build();
    }



}
