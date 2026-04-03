import Editor from '@monaco-editor/react';
import { FiRotateCcw } from 'react-icons/fi';
import './CodeEditor.css';

const DEFAULT_CODE = `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
        
        sc.close();
    }
}`;

export default function CodeEditor({ code, onChange, onReset }) {
  return (
    <div className="code-editor-wrapper">
      <div className="code-editor-header">
        <div className="code-editor-lang">
          <div className="code-editor-lang-dot" />
          Java
        </div>
        <div className="code-editor-actions">
          <button
            className="code-editor-reset"
            onClick={() => onReset?.(DEFAULT_CODE)}
            title="Reset code"
          >
            <FiRotateCcw size={12} style={{ marginRight: 4 }} />
            Reset
          </button>
        </div>
      </div>
      <Editor
        height="500px"
        defaultLanguage="java"
        value={code || DEFAULT_CODE}
        onChange={(value) => onChange?.(value)}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          suggestOnTriggerCharacters: true,
          bracketPairColorization: { enabled: true },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderLineHighlight: 'all',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
        }}
      />
    </div>
  );
}

export { DEFAULT_CODE };
