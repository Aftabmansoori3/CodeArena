package com.codearena.service;

import com.codearena.dto.LeaderboardEntry;
import com.codearena.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final SubmissionRepository submissionRepository;

    public List<LeaderboardEntry> getLeaderboard() {
        List<Object[]> results = submissionRepository.getLeaderboard();
        List<LeaderboardEntry> leaderboard = new ArrayList<>();

        int rank = 1;
        for (Object[] row : results) {
            leaderboard.add(LeaderboardEntry.builder()
                    .rank(rank++)
                    .userId((Long) row[0])
                    .username((String) row[1])
                    .problemsSolved((Long) row[2])
                    .build());
        }

        return leaderboard;
    }
}
