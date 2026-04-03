package com.codearena.service;

import com.codearena.dto.SubmissionRequest;
import com.codearena.dto.SubmissionResponse;
import com.codearena.entity.Problem;
import com.codearena.entity.Submission;
import com.codearena.entity.TestCase;
import com.codearena.entity.User;
import com.codearena.exception.ResourceNotFoundException;
import com.codearena.repository.ProblemRepository;
import com.codearena.repository.SubmissionRepository;
import com.codearena.repository.TestCaseRepository;
import com.codearena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final CodeExecutorService codeExecutorService;

    public SubmissionResponse submitCode(String username, SubmissionRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));

        List<TestCase> allTestCases = testCaseRepository
                .findByProblemIdOrderByOrderIndex(request.getProblemId());

        List<SubmissionResponse.TestCaseResult> testCaseResults = new ArrayList<>();
        int passedCount = 0;
        long totalExecutionTime = 0;
        String overallVerdict = "ACCEPTED";
        String errorOutput = null;

        for (int i = 0; i < allTestCases.size(); i++) {
            TestCase tc = allTestCases.get(i);

            CodeExecutorService.ExecutionResult result =
                    codeExecutorService.execute(request.getCode(), tc.getInput());

            totalExecutionTime += result.executionTimeMs();

            // Check for compilation / runtime errors
            if (!result.error().isEmpty()) {
                if (result.timedOut()) {
                    overallVerdict = "TIME_LIMIT_EXCEEDED";
                } else if (result.error().contains("error:") || result.error().contains("Error")) {
                    // Distinguish compilation vs runtime
                    if (result.error().contains(".java:")) {
                        overallVerdict = "COMPILATION_ERROR";
                    } else {
                        overallVerdict = "RUNTIME_ERROR";
                    }
                } else {
                    overallVerdict = "RUNTIME_ERROR";
                }
                errorOutput = result.error();

                testCaseResults.add(SubmissionResponse.TestCaseResult.builder()
                        .testCaseNumber(i + 1)
                        .input(tc.getIsHidden() ? "Hidden" : tc.getInput())
                        .expectedOutput(tc.getIsHidden() ? "Hidden" : tc.getExpectedOutput())
                        .actualOutput(result.error())
                        .passed(false)
                        .hidden(tc.getIsHidden())
                        .build());

                // For compilation errors, all subsequent tests will also fail
                if ("COMPILATION_ERROR".equals(overallVerdict)) {
                    for (int j = i + 1; j < allTestCases.size(); j++) {
                        TestCase remaining = allTestCases.get(j);
                        testCaseResults.add(SubmissionResponse.TestCaseResult.builder()
                                .testCaseNumber(j + 1)
                                .input(remaining.getIsHidden() ? "Hidden" : remaining.getInput())
                                .expectedOutput(remaining.getIsHidden() ? "Hidden" : remaining.getExpectedOutput())
                                .actualOutput("Compilation Error")
                                .passed(false)
                                .hidden(remaining.getIsHidden())
                                .build());
                    }
                    break;
                }
                continue;
            }

            // Compare output
            String expected = tc.getExpectedOutput().trim();
            String actual = result.output().trim();
            boolean passed = expected.equals(actual);

            if (passed) {
                passedCount++;
            } else {
                overallVerdict = "WRONG_ANSWER";
            }

            testCaseResults.add(SubmissionResponse.TestCaseResult.builder()
                    .testCaseNumber(i + 1)
                    .input(tc.getIsHidden() ? "Hidden" : tc.getInput())
                    .expectedOutput(tc.getIsHidden() ? "Hidden" : tc.getExpectedOutput())
                    .actualOutput(tc.getIsHidden() ? "Hidden" : actual)
                    .passed(passed)
                    .hidden(tc.getIsHidden())
                    .build());
        }

        if (passedCount == allTestCases.size()) {
            overallVerdict = "ACCEPTED";
        }

        // Save submission
        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .code(request.getCode())
                .language(request.getLanguage() != null ? request.getLanguage() : "JAVA")
                .verdict(overallVerdict)
                .passedCount(passedCount)
                .totalCount(allTestCases.size())
                .executionTimeMs(totalExecutionTime)
                .errorOutput(errorOutput)
                .build();

        submission = submissionRepository.save(submission);

        return SubmissionResponse.builder()
                .id(submission.getId())
                .problemId(problem.getId())
                .problemTitle(problem.getTitle())
                .code(request.getCode())
                .language(submission.getLanguage())
                .verdict(overallVerdict)
                .passedCount(passedCount)
                .totalCount(allTestCases.size())
                .executionTimeMs(totalExecutionTime)
                .errorOutput(errorOutput)
                .testCaseResults(testCaseResults)
                .submittedAt(submission.getSubmittedAt())
                .build();
    }

    public List<SubmissionResponse> getUserHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SubmissionResponse getSubmissionById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        return toResponse(submission);
    }

    private SubmissionResponse toResponse(Submission s) {
        return SubmissionResponse.builder()
                .id(s.getId())
                .problemId(s.getProblem().getId())
                .problemTitle(s.getProblem().getTitle())
                .code(s.getCode())
                .language(s.getLanguage())
                .verdict(s.getVerdict())
                .passedCount(s.getPassedCount())
                .totalCount(s.getTotalCount())
                .executionTimeMs(s.getExecutionTimeMs())
                .errorOutput(s.getErrorOutput())
                .submittedAt(s.getSubmittedAt())
                .build();
    }
}
