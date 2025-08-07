// backend/src/main/java/com/teamsync/backend/repository/ProjectMemberRepository.java
package com.teamsync.backend.repository;

import com.teamsync.backend.entity.Project;
import com.teamsync.backend.entity.ProjectMember;
import com.teamsync.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    /**
     * プロジェクトのメンバー一覧を取得
     */
    List<ProjectMember> findByProjectIdOrderByJoinedAtAsc(Long projectId);

    /**
     * ユーザーが参加しているプロジェクト一覧を取得
     */
    List<ProjectMember> findByUserIdOrderByJoinedAtDesc(Long userId);

    /**
     * プロジェクトの特定ユーザーのメンバー情報を取得
     */
    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * プロジェクトへのアクセス権限チェック
     */
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * プロジェクトの編集権限チェック（OWNER または ADMIN）
     */
    boolean existsByProjectIdAndUserIdAndRoleIn(Long projectId, Long userId, List<ProjectMember.MemberRole> roles);

    /**
     * プロジェクトのメンバー数を取得
     */
    long countByProjectId(Long projectId);

    /**
     * 特定の役割のメンバー数を取得
     */
    long countByProjectIdAndRole(Long projectId, ProjectMember.MemberRole role);

    /**
     * プロジェクトのオーナーを取得
     */
    Optional<ProjectMember> findByProjectIdAndRole(Long projectId, ProjectMember.MemberRole role);

    /**
     * プロジェクト削除時にメンバーを一括削除
     */
    @Modifying
    @Query("DELETE FROM ProjectMember pm WHERE pm.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);

    /**
     * ユーザーの役割別プロジェクト数を取得
     */
    long countByUserIdAndRole(Long userId, ProjectMember.MemberRole role);

    /**
     * プロジェクトから特定ユーザーを削除
     */
    void deleteByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * ユーザーが管理者権限を持つプロジェクト一覧
     */
    @Query("SELECT pm FROM ProjectMember pm WHERE pm.user.id = :userId " +
            "AND pm.role IN ('OWNER', 'ADMIN') " +
            "ORDER BY pm.joinedAt DESC")
    List<ProjectMember> findAdminProjectsByUserId(@Param("userId") Long userId);
}
