package com.codearena.repository;

import com.codearena.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblemIdOrderByOrderIndex(Long problemId);
    List<TestCase> findByProblemIdAndIsHiddenFalseOrderByOrderIndex(Long problemId);
}
