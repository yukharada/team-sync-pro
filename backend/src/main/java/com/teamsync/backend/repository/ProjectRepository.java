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

    // オーナーまたはメンバーとして参加しているプロジェクトを取得
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE p.owner = :user OR pm.user = :user " +
            "ORDER BY p.updatedAt DESC")
    List<Project> findProjectsByUser(@Param("user") User user);

    // オーナーまたはメンバーとして参加しているプロジェクト(ページング)
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE p.owner = :user OR pm.user = :user " +
            "ORDER BY p.updatedAt DESC")
    Page<Project> findProjectsByUser(@Param("user") User user, Pageable pageable);

    // オーナーのプロジェクトのみ取得
    List<Project> findByOwnerOrderByUpdatedAtDesc(User owner);

    // プロジェクト名で検索
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE (p.owner = :user OR pm.user = :user) " +
            "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "ORDER BY p.updatedAt DESC")
    List<Project> findProjectsByUserAndNameContaining(@Param("user") User user, @Param("name") String name);

    // ステータス別プロジェクト取得
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE (p.owner = :user OR pm.user = :user) " +
            "AND p.status = :status " +
            "ORDER BY p.updatedAt DESC")
    List<Project> findProjectsByUserAndStatus(@Param("user") User user, @Param("status") Project.ProjectStatus status);

    // プロジェクトIDとユーザーでアクセス権限チェック
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members pm " +
            "WHERE p.id = :projectId AND (p.owner = :user OR pm.user = :user) ")
    Optional<Project> findProjectByIdAndUser(@Param("projectId") Long projectId, @Param("user") User user);
}
