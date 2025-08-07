// backend/src/main/java/com/teamsync/backend/controller/ProjectController.java
package com.teamsync.backend.controller;

import com.teamsync.backend.dto.project.ProjectCreateRequest;
import com.teamsync.backend.dto.project.ProjectResponse;
import com.teamsync.backend.dto.project.ProjectUpdateRequest;
import com.teamsync.backend.repository.ProjectRepository;
import com.teamsync.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Project Management", description = "プロジェクト管理API")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "プロジェクト一覧取得", description = "ユーザーが参加しているプロジェクトの一覧を取得します")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "プロジェクト一覧取得成功"),
            @ApiResponse(responseCode = "401", description = "認証が必要です"),
            @ApiResponse(responseCode = "403", description = "アクセス権限がありません")
    })
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getProjects(
            Authentication authentication,
            @PageableDefault(size = 20)Pageable pageable
            ){

        log.info("プロジェクト一覧取得開始 - User: {}", authentication.getName());

        String username = authentication.getName();
        Page<ProjectResponse> projects = projectService.getUserProjects(username, pageable);

        log.info("プロジェクト一覧取得完了 - User: {}, Count: {}", username, projects.getTotalElements());
        return ResponseEntity.ok(projects);
    }

    @Operation(summary = "プロジェクト作成", description = "新しいプロジェクトを作成します")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "プロジェクト作成成功"),
            @ApiResponse(responseCode = "400", description = "リクエストデータが不正です"),
            @ApiResponse(responseCode = "401", description = "認証が必要です")
    })
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectCreateRequest request,
            Authentication authentication) {

        log.info("プロジェクト作成開始 - User: {}, Project: {}", authentication.getName(), request.getName());

        String username = authentication.getName();
        ProjectResponse project = projectService.createProject(request, username);

        log.info("プロジェクト作成完了 - User: {}, ProjectId: {}", username, project.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @Operation(summary = "プロジェクト詳細取得", description = "指定されたプロジェクトの詳細情報を取得します")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "プロジェクト詳細取得成功"),
            @ApiResponse(responseCode = "401", description = "認証が必要です"),
            @ApiResponse(responseCode = "403", description = "アクセス権限がありません"),
            @ApiResponse(responseCode = "404", description = "プロジェクトが見つかりません"),
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
            @Parameter(description = "プロジェクトID") @PathVariable Long id,
            Authentication authentication) throws AccessDeniedException {

        log.info("プロジェクト詳細取得開始 - User: {}, ProjectId: {}", authentication.getName(), id);

        String username = authentication.getName();
        ProjectResponse project = projectService.getProject(id, username);

        log.info("プロジェクト詳細取得完了 - User: {}, ProjectId: {}", username, id);
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "プロジェクト更新", description = "指定されたプロジェクトの情報を更新します")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "プロジェクト更新成功"),
            @ApiResponse(responseCode = "400", description = "リクエストデータが不正です"),
            @ApiResponse(responseCode = "401", description = "認証が必要です"),
            @ApiResponse(responseCode = "403", description = "更新権限がありません"),
            @ApiResponse(responseCode = "404", description = "プロジェクトが見つかりません"),
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @Parameter(description = "プロジェクトID") @PathVariable Long id,
            @Valid @RequestBody ProjectUpdateRequest request,
            Authentication authentication) throws AccessDeniedException {

        log.info("プロジェクト更新開始 - User: {}, ProjectId: {}", authentication.getName(), id);

        String username =authentication.getName();
        ProjectResponse project = projectService.updateProject(id, request, username);

        log.info("プロジェクト更新完了 - User: {}, ProjectId: {}", username, id);
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "プロジェクト削除", description = "指定されたプロジェクトを削除します")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "プロジェクト削除成功"),
            @ApiResponse(responseCode = "401", description = "認証が必要です"),
            @ApiResponse(responseCode = "403", description = "削除権限がありません"),
            @ApiResponse(responseCode = "404", description = "プロジェクトが見つかりません")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @Parameter(description = "プロジェクトID") @PathVariable Long id,
            Authentication authentication) throws AccessDeniedException {

        log.info("プロジェクト削除開始 - User: {}, ProjectId: {}", authentication.getName(), id);

        String username = authentication.getName();
        projectService.deleteProject(id, username);

        log.info("プロジェクト削除完了 - User: {}, ProjectId: {}", username, id);
        return ResponseEntity.noContent().build();
    }
}
