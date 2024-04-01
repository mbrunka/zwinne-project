package com.project.controller.teacher;

import com.project.model.Projekt;
import com.project.model.User;
import com.project.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/teacher")
public class TeacherRestController {

    private final UserService userService;

    public TeacherRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/accepted")
    public boolean isAccepted(@AuthenticationPrincipal User currentUser) {
        return currentUser.getRole().equals("NAUCZYCIEL");
    }

    @GetMapping("/myprojects")
    public Set<Projekt> getMyProjects(@AuthenticationPrincipal User currentUser) {
        return currentUser.getTeacher().getProjekty();
    }

}
