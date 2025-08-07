// backend/src/main/java/com/teamsync/backend/repository/ProjectRepository.java
package com.teamsync.backend.repository;

import com.teamsync.backend.entity.Project;
import com.teamsync.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // オーナーまたはメンバーとして参加しているプロジェクトを取得（非ページング）
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE p.owner = :user OR pm.user = :user " +
            "ORDER BY p.updatedAt DESC")
    List<Project> findProjectsByUser(@Param("user") User user);

    // オーナーまたはメンバーとして参加しているプロジェクト一覧を取得（ページング）
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE p.owner = :user OR pm.user = :user " +
            "ORDER BY p.updatedAt DESC")
    Page<Project> findProjectsByUser(@Param("user") User user, Pageable pageable);

    // オーナーのプロジェクトのみ取得
    List<Project> findByOwnerIdOrderByUpdatedAtDesc(Long ownerId);

    // プロジェクト名で検索（部分一致）
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE (p.owner = :user OR pm.user = :user) " +
            "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "ORDER BY p.updatedAt DESC")
    List<Project> findProjectsByUserAndNameContaining(@Param("user") User user, @Param("searchTerm") String searchTerm);

    // ステータス別プロジェクト取得
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE (p.owner = :user OR pm.user = :user) " +
            "AND p.status = :status " +
            "ORDER BY p.updatedAt DESC")
    List<Project> findProjectsByUserAndStatus(@Param("user") User user, @Param("status") Project.ProjectStatus status);

    // プロジェクト名の重複チェック（同一オーナー内）
    boolean existsByOwnerIdAndName(Long ownerId, String name);

    // プロジェクトIDとユーザーでアクセス権限チェック
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE p.id = :projectId AND (p.owner = :user OR pm.user = :user) ")
    Optional<Project> findProjectByIdAndUser(@Param("projectId") Long projectId, @Param("user") User user);

    // アクティブなプロジェクト数を取得
    @Query("SELECT COUNT(DISTINCT p) FROM Project p JOIN p.members pm " +
            "WHERE pm.user = :user " +
            "AND p.status IN ('PLANNING', 'ACTIVE')")
    long countActiveProjectsByUser(@Param("user") User user);
}
