package com.project.service;

import com.project.model.Status;

import java.util.Optional;

import org.springframework.stereotype.Service;

public interface StatusService {
    Optional<Status> getStatus(Long statusId);

    Status setStatus(Status status);

    void deleteStatus(Long statusId);



}
