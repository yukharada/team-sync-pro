package com.teamsync.backend.dto.project;

import com.teamsync.backend.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUpdateRequest {

    @NotBlank(message = "プロジェクト名は必須です")
    @Size(min = 1, max = 100, message = "プロジェクト名は1文字以上100文字以下で入力してください")
    private String name;

    @Size(max = 1000, message = "説明は1000文字以上で入力してください")
    private String description;

    private Project.ProjectStatus status;

    private Project.ProjectPriority priority;

    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 7, message = "カラーコードは7文字以下で入力してください")
    private String color;
}
