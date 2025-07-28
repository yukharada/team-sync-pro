package com.teamsync.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
public class Project extends BaseEntity{

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.PLANNING;

    @Enumerated(EnumType.STRING)
    private ProjectPriority priority = ProjectPriority.MEDIUM;

    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProjectMember> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Task> tasks = new HashSet<>();

    private String color = "#1976d2"; // デフォルトカラー

    // Constructors
    public Project() {}

    public Project(String name, String description, User owner) {
        this.name = name;
        this.description = description;
        this.owner = owner;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public ProjectPriority getPriority() { return priority; }
    public void setPriority(ProjectPriority priority) { this.priority = priority; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Set<ProjectMember> getMembers() { return members; }
    public void setMembers(Set<ProjectMember> members) { this.members = members; }

    public Set<Task> getTasks() { return tasks; }
    public void setTasks(Set<Task> tasks) { this.tasks = tasks; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    // Enums
    public enum ProjectStatus {
        PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
    }

    public enum ProjectPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

}
