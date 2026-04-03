package com.codearena.repository;

import com.codearena.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);

    @Query("SELECT s.user.id, s.user.username, COUNT(DISTINCT s.problem.id) as solved " +
           "FROM Submission s WHERE s.verdict = 'ACCEPTED' " +
           "GROUP BY s.user.id, s.user.username ORDER BY solved DESC")
    List<Object[]> getLeaderboard();

    long countByUserIdAndVerdict(Long userId, String verdict);
}
