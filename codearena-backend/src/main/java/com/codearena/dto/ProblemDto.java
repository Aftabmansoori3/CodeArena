package com.codearena.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemDto {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String sampleInput;
    private String sampleOutput;
    private String constraints;
    private List<TestCaseDto> visibleTestCases;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TestCaseDto {
        private Long id;
        private String input;
        private String expectedOutput;
        private Integer orderIndex;
    }
}
