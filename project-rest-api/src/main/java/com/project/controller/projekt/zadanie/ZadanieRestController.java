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
        Set<Student> students = studentService.getStudentsByIds(request.getStudentIds()); // Fetch students from database
        zadanie.get().setNazwa(request.getNazwa());
        zadanie.get().setOpis(request.getOpis());
        zadanie.get().setStatus(targetStatus.get());
        zadanie.get().setPiorytet(request.getPiorytet());
        zadanie.get().setStudenci(students);
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
        //TODO Wykomentowane bo wyrzuca błąd
//        if (!currentUser.getStudent().getProjekty().stream()
//                .anyMatch(proj -> proj.getProjektId().equals(projekt.getProjektId()))) {
//            return ResponseEntity.badRequest().body("Student is not a member of the project");
//        } else if (!currentUser.getTeacher().getProjekty().stream()
//                .anyMatch(proj -> proj.getProjektId().equals(projekt.getProjektId()))) {
//            return ResponseEntity.badRequest().body("Teacher is not a owner of the project");
//        }
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

    //TODO nic nie robi
    @PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
    @DeleteMapping("/task/{zadanieId}")
    public ResponseEntity<?> deleteZadanie(@PathVariable Long zadanieId) {
        zadanieService.deleteZadanie(zadanieId);
        return ResponseEntity.ok().build();
    }



}
