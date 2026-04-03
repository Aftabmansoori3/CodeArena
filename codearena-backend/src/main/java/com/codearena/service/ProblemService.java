package com.codearena.service;

import com.codearena.dto.ProblemDto;
import com.codearena.entity.Problem;
import com.codearena.entity.TestCase;
import com.codearena.exception.ResourceNotFoundException;
import com.codearena.repository.ProblemRepository;
import com.codearena.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    public List<ProblemDto> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    public ProblemDto getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));
        return toDetailDto(problem);
    }

    public List<ProblemDto> searchProblems(String keyword) {
        return problemRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    public List<ProblemDto> filterByDifficulty(String difficulty) {
        return problemRepository.findByDifficulty(difficulty.toUpperCase()).stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    private ProblemDto toSummaryDto(Problem problem) {
        return ProblemDto.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .createdAt(problem.getCreatedAt())
                .build();
    }

    private ProblemDto toDetailDto(Problem problem) {
        List<TestCase> visibleCases = testCaseRepository
                .findByProblemIdAndIsHiddenFalseOrderByOrderIndex(problem.getId());

        List<ProblemDto.TestCaseDto> testCaseDtos = visibleCases.stream()
                .map(tc -> ProblemDto.TestCaseDto.builder()
                        .id(tc.getId())
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .orderIndex(tc.getOrderIndex())
                        .build())
                .collect(Collectors.toList());

        return ProblemDto.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .sampleInput(problem.getSampleInput())
                .sampleOutput(problem.getSampleOutput())
                .constraints(problem.getConstraints())
                .visibleTestCases(testCaseDtos)
                .createdAt(problem.getCreatedAt())
                .build();
    }
}
