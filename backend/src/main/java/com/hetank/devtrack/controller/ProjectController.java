package com.hetank.devtrack.controller;

import com.hetank.devtrack.model.Project;
import com.hetank.devtrack.repository.ProjectRepository;
import com.hetank.devtrack.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;


    public ProjectController(
            ProjectRepository projectRepository,
            TaskRepository taskRepository) {

        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }


    @GetMapping
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }


    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Project not found"
                        )
                );
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(
            @RequestBody Project project) {

        project.setId(null);

        return projectRepository.save(project);
    }


    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project updatedProject) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Project not found"
                        )
                );

        project.setName(updatedProject.getName());
        project.setDescription(updatedProject.getDescription());
        project.setStatus(updatedProject.getStatus());

        return projectRepository.save(project);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Project not found"
                        )
                );

        taskRepository.deleteAll(
                taskRepository.findByProjectId(id)
        );

        projectRepository.delete(project);
    }
}
