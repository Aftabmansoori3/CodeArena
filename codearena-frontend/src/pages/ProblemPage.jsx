import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import CodeEditor, { DEFAULT_CODE } from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import DifficultyBadge from '../components/DifficultyBadge';
import { FiArrowLeft, FiPlay, FiSend } from 'react-icons/fi';
import './ProblemPage.css';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      const res = await API.get(`/problems/${id}`);
      setProblem(res.data);
    } catch (err) {
      console.error('Failed to load problem', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);

    try {
      const res = await API.post('/submissions', {
        problemId: Number(id),
        code,
        language: 'JAVA',
      });
      setResult(res.data);
    } catch (err) {
      setResult({
        verdict: 'ERROR',
        errorOutput: err.response?.data?.message || 'Submission failed',
        passedCount: 0,
        totalCount: 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="problem-loading">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-loading">
        <p style={{ color: 'var(--text-muted)' }}>Problem not found</p>
      </div>
    );
  }

  return (
    <div className="problem-page">
      <div className="problem-page-inner">
        {/* Left — Description */}
        <div className="problem-description">
          <Link to="/dashboard" className="problem-back">
            <FiArrowLeft size={14} />
            Back to Problems
          </Link>

          <div className="problem-title-row">
            <h1 className="problem-title">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>

          <div className="problem-section">
            <h3 className="problem-section-title">Description</h3>
            <div className="problem-text">{problem.description}</div>
          </div>

          {problem.constraints && (
            <div className="problem-section">
              <h3 className="problem-section-title">Constraints</h3>
              <div className="problem-constraints">{problem.constraints}</div>
            </div>
          )}

          {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
            <div className="problem-section">
              <h3 className="problem-section-title">Sample Test Cases</h3>
              <div className="sample-cases">
                {problem.visibleTestCases.map((tc, i) => (
                  <div key={i} className="sample-case">
                    <div className="sample-case-block">
                      <span className="sample-case-label">Input {i + 1}</span>
                      <div className="sample-case-value">{tc.input}</div>
                    </div>
                    <div className="sample-case-block">
                      <span className="sample-case-label">Output {i + 1}</span>
                      <div className="sample-case-value">{tc.expectedOutput}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Editor + Results */}
        <div className="problem-editor-panel">
          <div className="problem-editor-section">
            <CodeEditor
              code={code}
              onChange={setCode}
              onReset={(defaultCode) => setCode(defaultCode)}
            />
          </div>

          <div className="problem-submit-bar">
            <span className="problem-submit-info">
              Language: Java &nbsp;|&nbsp; Timeout: 5s
            </span>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" />
                  Judging...
                </>
              ) : (
                <>
                  <FiSend size={14} />
                  Submit Solution
                </>
              )}
            </button>
          </div>

          <div className="problem-results-section">
            <TestResults result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
