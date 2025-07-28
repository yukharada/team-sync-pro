package com.teamsync.backend.dto.project;

import com.teamsync.backend.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class ProjectCreateRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    private Project.ProjectPriority priority = Project.ProjectPriority.MEDIUM;

    private LocalDate startDate;
    private LocalDate endDate;

    private String color = "#1976d2";

    // Constructors
    public ProjectCreateRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Project.ProjectPriority getPriority() { return priority; }
    public void setPriority(Project.ProjectPriority priority) { this.priority = priority; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
