// backend/src/main/java/com/teamsync/backend/service/ProjectService.java
package com.teamsync.backend.service;

import com.teamsync.backend.dto.project.ProjectCreateRequest;
import com.teamsync.backend.dto.project.ProjectResponse;
import com.teamsync.backend.dto.project.ProjectUpdateRequest;
import com.teamsync.backend.entity.Project;
import com.teamsync.backend.entity.ProjectMember;
import com.teamsync.backend.entity.User;
import com.teamsync.backend.repository.ProjectMemberRepository;
import com.teamsync.backend.repository.ProjectRepository;
import com.teamsync.backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ユーザーが参加しているプロジェクト一覧取得（非ページング）
     * @param username
     * @return
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(String username){
        User user = getUserByUsername(username);

        List<Project> projects = projectRepository.findProjectsByUser(user);
        return projects.stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * ユーザーが参加しているプロジェクト一覧を取得（ページング対応）
     * @param username
     * @param pageable
     * @return
     */
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getUserProjects(String username, Pageable pageable){
        User user = getUserByUsername(username);

        Page<Project> projects = projectRepository.findProjectsByUser(user, pageable);
        return projects.map(ProjectResponse::new);
    }

    /**
     * プロジェクト詳細取得
     * @param projectId
     * @param username
     * @return
     */
    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long projectId, String username) throws AccessDeniedException {
        User user = getUserByUsername(username);
        Project project = getProjectByIdAndUser(projectId, user);

        // アクセス権限チェック
        if(!hasProjectAccess(project, user)) {
            throw  new AccessDeniedException("このプロジェクトにアクセスする権限がありません");
        }

        return new ProjectResponse(project);
    }

    /**
     * プロジェクト作成
     * @param request
     * @param username
     * @return
     */
    public ProjectResponse createProject(ProjectCreateRequest request, String username) {
        User owner = getUserByUsername(username);

        Project project = Project.builder()
                        .name(request.getName())
                        .description(request.getDescription())
                        .status(request.getStatus() != null ? request.getStatus() : Project.ProjectStatus.PLANNING)
                        .priority(request.getPriority() != null ? request.getPriority() : Project.ProjectPriority.MEDIUM)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .owner(owner)
                        .color(request.getColor() != null ? request.getColor() : "#1976d2")
                        .build();

        Project savedProject = projectRepository.save(project);

        // オーナーをプロジェクトメンバーとして追加
        ProjectMember projectMember = ProjectMember.builder()
                .project(savedProject)
                .user(owner)
                .role(ProjectMember.MemberRole.OWNER)
                .joinedAt(LocalDate.now())
                .build();

        projectMemberRepository.save(projectMember);

        log.info("プロジェクト作成完了 - ProjectId: {}, Owner: {}", savedProject.getId(), username);
        return new ProjectResponse((savedProject));
    }

    /**
     * プロジェクト更新
     * @param projectId
     * @param request
     * @param username
     * @return
     */
    public ProjectResponse updateProject(Long projectId, ProjectUpdateRequest request, String username) throws AccessDeniedException {
        User user = getUserByUsername(username);
        Project project = getProjectByIdAndUser(projectId, user);

        // 編集権限チェック(OWNER または ADMINのみ)
        if(!hasProjectEditAccess(project, user)) {
            throw new AccessDeniedException("このプロジェクトを編集する権限がありません");
        }

        project = Project.builder()
                        .name(request.getName())
                        .description(request.getDescription())
                        .status(request.getStatus() != null ? request.getStatus() : project.getStatus())
                        .priority(request.getPriority() != null ? request.getPriority() : project.getPriority())
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .color(request.getColor() != null ? request.getColor() : project.getColor())
                        .build();

        Project updatedProject = projectRepository.save(project);

        log.info("プロジェクト更新完了 - ProjectId: {}, User: {}", projectId, username);
        return new ProjectResponse(updatedProject);
    }

    /**
     * プロジェクト削除
     * @param projectId
     * @param username
     */
    public void deleteProject(Long projectId, String username) throws AccessDeniedException {
        User user = getUserByUsername(username);
        Project project = getProjectByIdAndUser(projectId, user);

        // オーナーのみ削除可能
        if(!project.getOwner().getId().equals(user.getId())){
            throw new AccessDeniedException("プロジェクトを削除できるのはオーナーのみです");
        }

        // プロジェクトメンバーを先に削除
        projectMemberRepository.deleteByProjectId(project.getId());

        // プロジェクト削除
        projectRepository.delete(project);

        log.info("プロジェクト削除完了 - ProjectId: {}, Owner: {}", projectId, username);
    }

    public List<ProjectResponse> searchProjects(String username, String query) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects = projectRepository.findProjectsByUserAndNameContaining(user, query);
        return projects.stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * ユーザーをユーザー名で検索する
     * @param username
     * @return
     */
    private User getUserByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません:" + username));
    }

    /**
     * プロジェクトをプロジェクトIDとユーザー情報で検索する
     * @param projectId
     * @param user
     * @return
     */
    private Project getProjectByIdAndUser(Long projectId, User user){
        return projectRepository.findProjectByIdAndUser(projectId, user)
                .orElseThrow(() -> new RuntimeException("プロジェクトが見つかりません:" + projectId + "" + user));
    }

    private boolean hasProjectAccess(Project project, User user) {
        return projectMemberRepository.existsByProjectIdAndUserId(project.getId(), user.getId());
    }

    private boolean hasProjectEditAccess(Project project, User user) {
        return projectMemberRepository.existsByProjectIdAndUserIdAndRoleIn(
                project.getId(),
                user.getId(),
                List.of(ProjectMember.MemberRole.OWNER, ProjectMember.MemberRole.ADMIN)
        );
    }
}
