package com.project.controller.projekt;

import com.project.auth.AuthenticationService;
import com.project.controller.projekt.requests.CreateProjectRequest;
import com.project.controller.projekt.requests.CreateStatusRequest;
import com.project.controller.projekt.requests.UpdateStatusRequest;
import com.project.model.Projekt;
import com.project.model.Status;
import com.project.model.User;
import com.project.model.Zadanie;
import com.project.repository.ProjektRepository;
import com.project.service.ProjektService;
import com.project.service.StatusService;
import com.project.service.ZadanieService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
@RequestMapping("/api/v1/projekty/teacher")
public class ProjectTeacherRestController {

    @Autowired
    private ProjektService projektService;

    @Autowired
    private StatusService statusService;

    @Autowired
    private ProjektRepository projektRepository;

    @Autowired
    private ZadanieService zadanieService;


    @PostMapping("/create")
    @Transactional
    ResponseEntity<Void> createProjekt(@RequestBody CreateProjectRequest request, @AuthenticationPrincipal User currentUser) {
        var projekt = Projekt.builder()
                .nazwa(request.getNazwa())
                .opis(request.getOpis())
                .teacher(currentUser.getTeacher())
                .build();

        // Save the updated Projekt object to the database
        Projekt createdProjekt = projektService.setProjekt(projekt);

        // Add default statusy
        Status status1 = Status.builder()
                .nazwa("Do zrobienia")
                .kolor("#FF0000")
                .waga(50)
                .projekt(createdProjekt)
                .build();
        Status status2 = Status.builder()
                .nazwa("W trakcie")
                .kolor("#FFFF00")
                .waga(100)
                .projekt(createdProjekt)
                .build();
        Status status3 = Status.builder()
                .nazwa("Zrobione")
                .kolor("#00FF00")
                .waga(150)
                .projekt(createdProjekt)
                .build();
        statusService.setStatus(status1);
        statusService.setStatus(status2);
        statusService.setStatus(status3);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{projektId}").buildAndExpand(createdProjekt.getProjektId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PatchMapping("/{projektId}")
    public ResponseEntity<Void> updateProjekt(@RequestBody CreateProjectRequest request,
                                              @PathVariable Long projektId,
                                              @AuthenticationPrincipal User currentUser) {
        Optional<Projekt> projekt = projektService.getProjekt(projektId);
        if (projekt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!projekt.get().getTeacher().getTeacherId().equals(currentUser.getTeacher().getTeacherId())) {
            return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
        }
        projekt.get().setNazwa(request.getNazwa());
        projekt.get().setOpis(request.getOpis());
        projektRepository.save(projekt.get());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{projektId}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable Long projektId,
                                              @AuthenticationPrincipal User currentUser) {
        return projektService.getProjekt(projektId).map(p -> {
            if (!p.getTeacher().getTeacherId().equals(currentUser.getTeacher().getTeacherId())) {
                return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
            }
            Projekt projekt = projektService.getProjekt(projektId).orElseThrow();
            Set<Status> statusy = projekt.getStatusy();
            for (Status status : statusy) {
                Set<Zadanie> zadania = status.getZadania();
                for (Zadanie zadanie : zadania) {
                    zadanieService.deleteZadanie(zadanie.getZadanieId());
                }
                statusService.deleteStatus(status.getStatusId());
            }
            projektService.deleteProjekt(projektId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{projektId}/code")
    public ResponseEntity<String> getJoinCode(@PathVariable Long projektId,
                                              @AuthenticationPrincipal User currentUser) {
        return projektService.getProjekt(projektId).map(p -> {
            if (!p.getTeacher().getTeacherId().equals(currentUser.getTeacher().getTeacherId())) {
                return new ResponseEntity<String>(HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<String>(p.getJoinCode(), HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/status")
    public ResponseEntity<Status> createStatus(@RequestBody CreateStatusRequest request,
                                               @AuthenticationPrincipal User currentUser) {
        Optional<Projekt> projekt = projektService.getProjekt(request.getProjektId());
        if (projekt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Status status = Status.builder()
                .nazwa(request.getNazwa())
                .kolor(request.getKolor())
                .waga(request.getWaga())
                .projekt(projekt.get())
                .build();
        Status createdStatus = statusService.setStatus(status);
        return ResponseEntity.ok(createdStatus);
    }

    @PatchMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestBody UpdateStatusRequest request,
                                            @AuthenticationPrincipal User currentUser) {
        Optional<Status> status = statusService.getStatus(request.getStatusId());
        if (status.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!status.get().getProjekt().getTeacher().getTeacherId().equals(currentUser.getTeacher().getTeacherId())) {
            return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
        }
        status.get().setNazwa(request.getNazwa());
        status.get().setKolor(request.getKolor());
        status.get().setWaga(request.getWaga());
        return ResponseEntity.ok(statusService.setStatus(status.get()));
    }


    //chaba git:TODO nie usuwa, gdy np. do statusu są przypisane jakieś zadanie (trzeba dodać cascade w jakiś sposób)
    @DeleteMapping("/status/{statusId}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Long statusId,
                                            @AuthenticationPrincipal User currentUser) {
        Optional<Status> status = statusService.getStatus(statusId);
        if (status.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!status.get().getProjekt().getTeacher().getTeacherId().equals(currentUser.getTeacher().getTeacherId())) {
            return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
        }
        if (!status.get().getZadania().isEmpty()) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }
        statusService.deleteStatus(statusId);
        return ResponseEntity.ok().build();
    }

}
