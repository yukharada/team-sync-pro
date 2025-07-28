// backend/src/main/java/com/teamsync/backend/dto/project/ProjectResponse.java
package com.teamsync.backend.dto.project;

import com.teamsync.backend.entity.Project;
import com.teamsync.backend.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private Project.ProjectStatus status;
    private Project.ProjectPriority priority;
    private LocalDate startDate;
    private LocalDate endDate;
    private String color;

    private UserInfo owner;
    private int memberCount;
    private int taskCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ProjectResponse() {}

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.status = project.getStatus();
        this.priority = project.getPriority();
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.color = project.getColor();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();

        if (project.getOwner() != null) {
            this.owner = new UserInfo(project.getOwner());
        }

        this.memberCount = project.getMembers().size();
        this.taskCount = project.getTasks().size();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Project.ProjectStatus getStatus() { return status; }
    public void setStatus(Project.ProjectStatus status) { this.status = status; }

    public Project.ProjectPriority getPriority() { return priority; }
    public void setPriority(Project.ProjectPriority priority) { this.priority = priority; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public UserInfo getOwner() { return owner; }
    public void setOwner(UserInfo owner) { this.owner = owner; }

    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }

    public int getTaskCount() { return taskCount; }
    public void setTaskCount(int taskCount) { this.taskCount = taskCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Inner Class for user info
    public static class UserInfo {
        private Long id;
        private String username;
        private String firstName;
        private String lastName;

        public UserInfo(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }
}
