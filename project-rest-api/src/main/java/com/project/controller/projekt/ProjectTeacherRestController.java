package com.project.controller.projekt;

import com.project.auth.AuthenticationService;
import com.project.controller.projekt.requests.CreateProjectRequest;
import com.project.model.Projekt;
import com.project.model.User;
import com.project.repository.ProjektRepository;
import com.project.service.ProjektService;
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
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('NAUCZYCIEL', 'ADMIN')")
@RequestMapping("/api/v1/projekty/teacher")
public class ProjectTeacherRestController {
    private final ProjektService projektService;
    private final ProjektRepository projektRepository;

    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    public ProjectTeacherRestController(ProjektService projektService, ProjektRepository projektRepository) {
        this.projektService = projektService;
        this.projektRepository = projektRepository;
    }



    @PostMapping("/create")
    ResponseEntity<Void> createProjekt(@RequestBody CreateProjectRequest request, @AuthenticationPrincipal User currentUser) {// @RequestBody oznacza, że dane
        var projekt = Projekt.builder() // przesłane w ciele żądania mają być zdeserializowane do obiektu
                .nazwa(request.getNazwa())
                .opis(request.getOpis())
                .teacher(currentUser.getTeacher())
                .build();
        Projekt createdProjekt = projektService.setProjekt(projekt); // utworzenie projektu
        URI location = ServletUriComponentsBuilder.fromCurrentRequest() // link wskazujący utworzony projekt
                .path("/{projektId}").buildAndExpand(createdProjekt.getProjektId()).toUri();
        return ResponseEntity.created(location).build(); // zwracany jest kod odpowiedzi 201 - Created
    } // z linkiem location w nagłówku


    // @Valid włącza automatyczną walidację na podstawie adnotacji zawartych
    // w modelu np. NotNull, Size, NotEmpty itd. (z jakarta.validation.constraints.*)
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

}
