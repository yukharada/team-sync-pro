// backend/src/main/java/com/teamsync/backend/service/ProjectService.java
package com.teamsync.backend.service;

import com.teamsync.backend.dto.project.ProjectCreateRequest;
import com.teamsync.backend.dto.project.ProjectResponse;
import com.teamsync.backend.entity.Project;
import com.teamsync.backend.entity.User;
import com.teamsync.backend.repository.ProjectRepository;
import com.teamsync.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProjectResponse> getUserProjects(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findProjectsByUser(user);
        return projects.stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    public Page<ProjectResponse> getUserProjects(String username, Pageable pageable){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<Project> projects = projectRepository.findProjectsByUser(user, pageable);
        return projects.map(ProjectResponse::new);
    }

    public ProjectResponse getProject(Long projectId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findProjectByIdAndUser(projectId, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        return new ProjectResponse(project);
    }

    public ProjectResponse createProject(ProjectCreateRequest request, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setPriority(request.getPriority());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setColor(request.getColor());
        project.setOwner(owner);

        Project savedProject = projectRepository.save(project);
        return new ProjectResponse((savedProject));
    }

    public ProjectResponse updateProject(Long projectId, ProjectCreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findProjectByIdAndUser(projectId, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        // オーナーのみ更新可能
        if(!project.getOwner().getId().equals(user.getId())){
            throw new RuntimeException("Only project owner can update project");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setPriority(request.getPriority());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setColor(request.getColor());

        Project updatedProject = projectRepository.save(project);
        return new ProjectResponse(updatedProject);
    }

    public void deleteProject(Long projectId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findProjectByIdAndUser(projectId, user)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        // オーナーのみ削除可能
        if(!project.getOwner().getId().equals(user.getId())){
            throw new RuntimeException("Only project owner can delete project");
        }

        projectRepository.delete(project);
    }

    public List<ProjectResponse> searchProjects(String username, String query) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findProjectsByUserAndNameContaining(user, query);
        return projects.stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }
}
