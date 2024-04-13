package com.project.service;

import com.project.model.Status;
import com.project.repository.StatusRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StatusServiceImpl implements StatusService{
    private final StatusRepository statusRepository;

    public StatusServiceImpl(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    public Optional<Status> getStatus(Long statusId) {
        return statusRepository.findById(statusId);
    }

    @Override
    public Status setStatus(Status status) {
        return statusRepository.save(status);
    }

    @Override
    public void deleteStatus(Long statusId) {
        statusRepository.deleteById(statusId);
    }


}
