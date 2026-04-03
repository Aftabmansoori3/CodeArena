package com.codearena.controller;

import com.codearena.dto.ProblemDto;
import com.codearena.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<List<ProblemDto>> getAllProblems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(problemService.searchProblems(search));
        }
        if (difficulty != null && !difficulty.isEmpty()) {
            return ResponseEntity.ok(problemService.filterByDifficulty(difficulty));
        }
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemDto> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }
}
