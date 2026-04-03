import { FiCheck, FiX, FiClock, FiCpu } from 'react-icons/fi';
import './TestResults.css';

export default function TestResults({ result }) {
  if (!result) return null;

  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'ACCEPTED': return 'verdict-accepted';
      case 'WRONG_ANSWER': return 'verdict-wrong';
      default: return 'verdict-error';
    }
  };

  const getVerdictLabel = (verdict) => {
    switch (verdict) {
      case 'ACCEPTED': return '✓ Accepted';
      case 'WRONG_ANSWER': return '✗ Wrong Answer';
      case 'COMPILATION_ERROR': return '⚠ Compilation Error';
      case 'RUNTIME_ERROR': return '⚠ Runtime Error';
      case 'TIME_LIMIT_EXCEEDED': return '⏱ Time Limit Exceeded';
      default: return verdict;
    }
  };

  return (
    <div className="test-results">
      <div className="test-results-header">
        <span className="test-results-title">Results</span>
        <span className={`test-results-verdict ${getVerdictClass(result.verdict)}`}>
          {getVerdictLabel(result.verdict)}
        </span>
      </div>

      <div className="test-results-stats">
        <div className="test-stat">
          <FiCheck size={14} />
          Passed: <span className="test-stat-value">{result.passedCount}/{result.totalCount}</span>
        </div>
        <div className="test-stat">
          <FiClock size={14} />
          Time: <span className="test-stat-value">{result.executionTimeMs || 0}ms</span>
        </div>
      </div>

      {result.errorOutput && (
        <div className="error-output">
          <pre>{result.errorOutput}</pre>
        </div>
      )}

      {result.testCaseResults && (
        <ul className="test-results-list">
          {result.testCaseResults.map((tc, i) => (
            <li key={i} className="test-case-item">
              <div className={`test-case-status ${tc.passed ? 'passed' : 'failed'}`}>
                {tc.passed ? <FiCheck /> : <FiX />}
              </div>
              <div className="test-case-content">
                <div className="test-case-number">
                  Test Case {tc.testCaseNumber}
                  {tc.hidden && <span className="test-case-hidden-label"> (Hidden)</span>}
                </div>
                {!tc.hidden ? (
                  <div className="test-case-details">
                    <div className="test-case-detail">
                      <span className="test-case-detail-label">Input</span>
                      <span className="test-case-detail-value">{tc.input}</span>
                    </div>
                    <div className="test-case-detail">
                      <span className="test-case-detail-label">Expected</span>
                      <span className="test-case-detail-value">{tc.expectedOutput}</span>
                    </div>
                    <div className="test-case-detail">
                      <span className="test-case-detail-label">Output</span>
                      <span className="test-case-detail-value">{tc.actualOutput}</span>
                    </div>
                  </div>
                ) : (
                  <div className="test-case-hidden-label">
                    {tc.passed ? 'Passed' : 'Failed'} — details hidden
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
