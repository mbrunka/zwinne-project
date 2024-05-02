package com.project.controller.projekt.zadanie;

import com.project.controller.projekt.zadanie.requests.ChangeZadanieStatusRequest;
import com.project.controller.projekt.zadanie.requests.SetZadanieRequest;
import com.project.model.*;
import com.project.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController // przez kontener Springa REST-owy kontroler obsługujący sieciowe żądania
@CrossOrigin
@RequestMapping("/api/v1/projekty/")
public class ZadanieRestController {

    private final ProjektService projektService;
    private final ZadanieService zadanieService;
    private final StatusService statusService;
    private final StudentService studentService;

    @Autowired
    public ZadanieRestController(ProjektService projektService, ZadanieService zadanieService, StatusService statusService, StudentService studentService) {
        this.projektService = projektService;
        this.zadanieService = zadanieService;
        this.statusService = statusService;
        this.studentService = studentService;
    }

    @GetMapping("/{projektId}/tasks")
    public ResponseEntity<List<Zadanie>> getZadania(@PathVariable Long projektId) {
        Projekt projekt = projektService.getProjekt(projektId).orElseThrow();
        List<Zadanie> zadania = projekt.getZadania();
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

    //chyba już git:TODO nie działa - studentIds jest chyba jako puste
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

    @PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
    @PatchMapping("/task/status")
    public ResponseEntity<?> updateZadanieStatus(@RequestBody ChangeZadanieStatusRequest request,
                                                 @AuthenticationPrincipal User currentUser) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(request.getZadanieId());
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        Projekt projekt = zadanie.get().getProjekt();
        //chyba już git: TODO Wykomentowae bo wyrzuca błąd
        if (currentUser.getRole().equals(Role.NAUCZYCIEL)) {
            if (projekt.getTeacher() != currentUser.getTeacher()) {
                return ResponseEntity.badRequest().body("You are not allowed to change status of this task");
            }
        }
        Optional<Status> targetStatus = statusService.getStatus(request.getStatusId());
        if (targetStatus.isEmpty()) {
            return ResponseEntity.badRequest().body("Status not found");
        }
        zadanie.get().setStatus(targetStatus.get());
        Zadanie updatedZadanie = zadanieService.setZadanie(zadanie.get());
        return ResponseEntity.ok(updatedZadanie);
    }


    //TODO ERROR: null value in column "projekt_id" of relation "projekt_student" violates not-null constraint
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

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/task/{zadanieId}/leave")
    public ResponseEntity<?> leaveZadanie(@PathVariable Long zadanieId, @AuthenticationPrincipal User currentUser) {
        Optional<Zadanie> zadanie = zadanieService.getZadanie(zadanieId);
        if (zadanie.isEmpty()) {
            return ResponseEntity.badRequest().body("Zadanie not found");
        }
        zadanie.get().getStudenci().remove(currentUser.getStudent());
        zadanieService.setZadanie(zadanie.get());
        return ResponseEntity.ok().build();
    }

    //chyba już git:TODO nie usuwa zadania, gdy jest ono wykorzystane w jakiejś innej tabeli jako PK (np. gdy wykorzystane w zadania_student)
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
