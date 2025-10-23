'use client';

import { useEffect, useMemo, useState } from 'react';

type TabItem = { id: string; title: string; content: string };
type StorageShape = { tabs: TabItem[]; activeId?: string; lastModified?: string };

const STORAGE_KEY = 'a1_tabs_v1';

export default function HomePage() {
  // ---------- state ----------
  const [ready, setReady] = useState(false); // becomes true after initial load
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: '1',
      title: 'Welcome',
      content: 'This is your first tab. You can add your content and more tabs as per your need.',
    },
  ]);
  const [activeId, setActiveId] = useState('1');

  // Output Panel
  const [showOutput, setShowOutput] = useState(false);
  const [outputCode, setOutputCode] = useState('');

  // ---------- initial load from localStorage ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StorageShape = JSON.parse(raw);
        if (Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
          setTabs(parsed.tabs);
          setActiveId(parsed.activeId ?? parsed.tabs[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to read tabs from localStorage', e);
    } finally {
      setReady(true);
    }
  }, []);

  // ---------- persist to localStorage (only after initial load) ----------
  useEffect(() => {
    if (!ready) return;
    try {
      const payload: StorageShape = {
        tabs,
        activeId,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to write tabs to localStorage', e);
    }
  }, [tabs, activeId, ready]);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeId) ?? tabs[0],
    [tabs, activeId]
  );

  // ---------- actions ----------
  const addTab = () => {
    if (tabs.length >= 15) return; // rubric cap
    const n = tabs.length + 1;
    const id = String(Date.now()); // client-only ID is fine here
    setTabs((prev) => [
      ...prev,
      {
        id,
        title: `Tab ${n}`,
        content: `This is Tab ${n}. You can add your content and more tabs as per your need.`,
      },
    ]);
    setActiveId(id);
  };

  const removeActive = () => {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex((t) => t.id === activeId);
    const next = tabs.filter((t) => t.id !== activeId);
    setTabs(next);
    setActiveId(next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? '');
  };

  const updateTitle = (v: string) => {
    setTabs((prev) => prev.map((t) => (t.id === activeId ? { ...t, title: v } : t)));
  };
  const updateContent = (v: string) => {
    setTabs((prev) => prev.map((t) => (t.id === activeId ? { ...t, content: v } : t)));
  };

  // ---------- output ----------
  const buildSimpleHTML = (items: TabItem[]) => {
    const btns = items
      .map((t, i) => `    <button onclick="openTab(${i})">${escapeHtml(t.title)}</button>`)
      .join('\n');

    const panels = items
      .map(
        (t, i) =>
          `  <div id="tab${i}"${i === 0 ? '' : ' style="display:none;"'}>${escapeHtml(t.content)}</div>`
      )
      .join('\n');

    // Inline CSS only in the generated file (no classes)
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tabs Example</title>
</head>
<body style="font-family:sans-serif;padding:16px;">
  <div style="display:flex;gap:8px;margin-bottom:12px;">
${btns}
  </div>
${panels}
  <script>
    function openTab(i) {
      for (let j = 0; j < ${items.length}; j++) {
        document.getElementById("tab"+j).style.display = j === i ? "block" : "none";
      }
    }
  </script>
</body>
</html>`;
  };

  const generateOutput = () => {
    setOutputCode(buildSimpleHTML(tabs));
    setShowOutput(true);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(outputCode);
      alert('Code copied to clipboard!');
    } catch {
      alert('Copy failed. Select and copy manually.');
    }
  };

  // ---------- avoid SSR mismatch while loading ----------
  if (!ready) {
    return <div style={{ minHeight: 120 }} />;
  }

  // ---------- UI ----------
  return (
    <div
      style={{
        padding: '16px 20px',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: '16px',
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left Tab side */}
      <section
        aria-label="Tabs"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: 16,
          minWidth: 0,
          minHeight: 0,
          height: '95%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gap: 12,
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Tabs</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: 'var(--muted-color)', fontSize: 12 }}>{tabs.length}/15</span>
            <button
              onClick={addTab}
              disabled={tabs.length >= 15}
              style={{
                border: 'none',
                background: tabs.length >= 15 ? 'var(--border-color)' : 'var(--success-bg)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 8,
                cursor: tabs.length >= 15 ? 'not-allowed' : 'pointer',
                opacity: tabs.length >= 15 ? 0.7 : 1,
              }}
            >
              + Add Tab
            </button>
            <button
              onClick={removeActive}
              disabled={tabs.length <= 1}
              style={{
                border: 'none',
                background: 'var(--danger-bg)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 8,
                cursor: tabs.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: tabs.length <= 1 ? 0.6 : 1,
              }}
            >
              − Remove Tab
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: 12,
            minHeight: 0,
            height: '100%',
          }}
        >
          {/* Tab headers */}
          <div
            role="tablist"
            aria-label="Tab headers"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'var(--nav-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: 8,
              overflowY: 'auto',
              minHeight: 0,
            }}
          >
            {tabs.map((t) => {
              const active = t.id === activeId;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(t.id)}
                  style={{
                    textAlign: 'left',
                    border: 'none',
                    background: active ? 'var(--button-bg)' : 'transparent',
                    color: active ? '#fff' : 'var(--foreground)',
                    padding: '10px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={t.title}
                >
                  {t.title || 'Untitled'}
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <div
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              overflow: 'hidden',
              minHeight: 0,
              display: 'grid',
              gridTemplateRows: 'auto auto 1fr',
            }}
          >
            <div
              style={{
                background: 'var(--nav-bg)',
                padding: '10px 14px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <strong>Editing:</strong> {activeTab?.title || 'Untitled'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, padding: '12px 14px' }}>
              <label style={{ alignSelf: 'center' }}>Tab Title</label>
              <input
                value={activeTab?.title || ''}
                onChange={(e) => updateTitle(e.target.value)}
                maxLength={50}
                style={{
                  width: '95%',
                  padding: 10,
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div style={{ padding: 14, minHeight: 0, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 8 }}>
              <label style={{ display: 'block' }}>Content</label>
              <textarea
                value={activeTab?.content || ''}
                onChange={(e) => updateContent(e.target.value)}
                maxLength={2000}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 220,
                  resize: 'none',
                  padding: 12,
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--muted-color)' }}>
                {(activeTab?.content?.length || 0)}/2000
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Output */}
      <section
        aria-label="Output"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: 16,
          minWidth: 0,
          minHeight: 0,
          height: '95%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Output</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              onClick={generateOutput}
              style={{
                border: 'none',
                background: 'var(--button-bg)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Generate Output
            </button>
            {showOutput && (
              <button
                onClick={copyCode}
                style={{
                  border: 'none',
                  background: 'var(--button-bg)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Copy Code
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            background: 'var(--nav-bg)',
            border: '1px solid var(--border-color)',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 14,
            color: 'var(--muted-color)',
          }}
        >
          {showOutput ? 'Generated HTML5 + inline CSS/JS (standalone)' : 'Click “Generate Output” to show the code'}
        </div>

        <div
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            background: showOutput ? '#0b1020' : 'transparent',
            color: '#e6e6e6',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
            fontSize: 12,
            lineHeight: 1.5,
            padding: showOutput ? 14 : 0,
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          {showOutput && (
            <pre style={{ margin: 0, whiteSpace: 'pre', minHeight: 240 }}>
              <code dangerouslySetInnerHTML={{ __html: highlightHtml(outputCode) }} />
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------- helpers ----------
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;/').replace(/>/g, '&gt;');
}
function span(text: string, cls: string) {
  return `<span class="${cls}">${text}</span>`;
}
function highlightHtml(src: string) {
  let s = escapeHtml(src);

  s = s.replace(/(&lt;\/?)([\w-]+)(.*?&gt;)/g, (_m, p1, tag, rest) => `${span(p1, 'c-gray')}${span(tag, 'c-purple')}${rest}`);

  s = s.replace(/([\s])([\w-:]+)=(".*?"|'.*?')/g, (_m, sp, attr, val) => `${sp}${span(attr, 'c-teal')}=${span(val, 'c-yellow')}`);

  s = s.replace(/\b(function|let|const|var|for|if|return|document|getElementById)\b/g, (m) => span(m, 'c-blue'));

  // numbers
  s = s.replace(/\b\d+\b/g, (m) => span(m, 'c-orange'));

  const palette = `
    <style>
      .c-gray{color:#9aa0ac}
      .c-purple{color:#c792ea}
      .c-teal{color:#80cbc4}
      .c-yellow{color:#ffcb6b}
      .c-blue{color:#82aaff}
      .c-orange{color:#f78c6c}
    </style>
  `;
  return palette + s;
}
