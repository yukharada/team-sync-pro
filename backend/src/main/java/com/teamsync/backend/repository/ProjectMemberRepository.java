// backend/src/main/java/com/teamsync/backend/repository/ProjectMemberRepository.java
package com.teamsync.backend.repository;

import com.teamsync.backend.entity.Project;
import com.teamsync.backend.entity.ProjectMember;
import com.teamsync.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProject(Project project);
    List<ProjectMember> findByUser(User user);

    Optional<ProjectMember> findByProjectAndUser(Project project, User user);

    boolean existsByProjectAndUser(Project project, User user);

    void deleteByProjectAndUser(Project project, User user);

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId")
    List<ProjectMember> findByProjectId(@Param("projectId") Long projectId);
}
