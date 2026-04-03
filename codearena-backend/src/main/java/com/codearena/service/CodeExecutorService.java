package com.codearena.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;

@Service
@Slf4j
public class CodeExecutorService {

    @Value("${app.code-execution.timeout-seconds}")
    private int timeoutSeconds;

    @Value("${app.code-execution.use-docker}")
    private boolean useDocker;

    public record ExecutionResult(String output, String error, boolean timedOut, long executionTimeMs) {}

    public ExecutionResult execute(String javaCode, String input) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("codearena_");
            Path sourceFile = tempDir.resolve("Solution.java");
            Files.writeString(sourceFile, javaCode);

            if (useDocker) {
                return executeWithDocker(tempDir, input);
            } else {
                return executeWithProcess(tempDir, input);
            }
        } catch (Exception e) {
            log.error("Code execution error", e);
            return new ExecutionResult("", "Internal execution error: " + e.getMessage(), false, 0);
        } finally {
            cleanupTempDir(tempDir);
        }
    }

    private ExecutionResult executeWithProcess(Path tempDir, String input) throws Exception {
        // Compile
        ProcessBuilder compileBuilder = new ProcessBuilder("javac", "Solution.java");
        compileBuilder.directory(tempDir.toFile());
        compileBuilder.redirectErrorStream(false);

        Process compileProcess = compileBuilder.start();
        String compileError = readStream(compileProcess.getErrorStream());
        boolean compiled = compileProcess.waitFor(timeoutSeconds, TimeUnit.SECONDS);

        if (!compiled) {
            compileProcess.destroyForcibly();
            return new ExecutionResult("", "Compilation timed out", true, 0);
        }

        if (compileProcess.exitValue() != 0) {
            return new ExecutionResult("", compileError, false, 0);
        }

        // Run
        ProcessBuilder runBuilder = new ProcessBuilder("java", "-cp", tempDir.toString(), "Solution");
        runBuilder.directory(tempDir.toFile());
        runBuilder.redirectErrorStream(false);

        long startTime = System.currentTimeMillis();
        Process runProcess = runBuilder.start();

        // Feed input
        if (input != null && !input.isEmpty()) {
            try (OutputStream os = runProcess.getOutputStream()) {
                os.write(input.getBytes());
                os.flush();
            }
        }

        // Read output with timeout
        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<String> outputFuture = executor.submit(() -> readStream(runProcess.getInputStream()));
        Future<String> errorFuture = executor.submit(() -> readStream(runProcess.getErrorStream()));

        boolean finished = runProcess.waitFor(timeoutSeconds, TimeUnit.SECONDS);
        long executionTime = System.currentTimeMillis() - startTime;

        if (!finished) {
            runProcess.destroyForcibly();
            executor.shutdownNow();
            return new ExecutionResult("", "Time Limit Exceeded", true, executionTime);
        }

        String output = outputFuture.get(1, TimeUnit.SECONDS);
        String error = errorFuture.get(1, TimeUnit.SECONDS);
        executor.shutdown();

        if (runProcess.exitValue() != 0) {
            return new ExecutionResult("", error.isEmpty() ? "Runtime Error" : error, false, executionTime);
        }

        return new ExecutionResult(output, "", false, executionTime);
    }

    private ExecutionResult executeWithDocker(Path tempDir, String input) throws Exception {
        String containerName = "codearena_" + System.currentTimeMillis();

        ProcessBuilder dockerBuilder = new ProcessBuilder(
                "docker", "run", "--rm",
                "--name", containerName,
                "--network=none",
                "--memory=256m",
                "--cpus=0.5",
                "--pids-limit=50",
                "--security-opt=no-new-privileges",
                "-v", tempDir.toAbsolutePath() + ":/code:ro",
                "-w", "/code",
                "judge-java",
                "sh", "-c", "javac Solution.java && java Solution"
        );

        dockerBuilder.redirectErrorStream(false);

        long startTime = System.currentTimeMillis();
        Process process = dockerBuilder.start();

        if (input != null && !input.isEmpty()) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(input.getBytes());
                os.flush();
            }
        }

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<String> outputFuture = executor.submit(() -> readStream(process.getInputStream()));
        Future<String> errorFuture = executor.submit(() -> readStream(process.getErrorStream()));

        boolean finished = process.waitFor(timeoutSeconds + 5, TimeUnit.SECONDS);
        long executionTime = System.currentTimeMillis() - startTime;

        if (!finished) {
            process.destroyForcibly();
            // Kill docker container
            new ProcessBuilder("docker", "kill", containerName).start().waitFor(5, TimeUnit.SECONDS);
            executor.shutdownNow();
            return new ExecutionResult("", "Time Limit Exceeded", true, executionTime);
        }

        String output = outputFuture.get(2, TimeUnit.SECONDS);
        String error = errorFuture.get(2, TimeUnit.SECONDS);
        executor.shutdown();

        if (process.exitValue() != 0) {
            return new ExecutionResult("", error.isEmpty() ? "Runtime Error" : error, false, executionTime);
        }

        return new ExecutionResult(output, "", false, executionTime);
    }

    private String readStream(InputStream stream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString().trim();
    }

    private void cleanupTempDir(Path tempDir) {
        if (tempDir == null) return;
        try {
            Files.walk(tempDir)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try { Files.deleteIfExists(path); } catch (IOException ignored) {}
                    });
        } catch (IOException ignored) {}
    }
}
