import React from 'react';
import styles from '../court-room/court-room.module.css';

interface CodeEditorPanelProps {
    userCode: string;
    timeRemaining: number;
    selectedGameTime: number;
    isRunning: boolean;
    unreadCount: number;
    onCodeChange: (newCode: string) => void;
    onGenerateFinalCode: () => void;
    onPauseResume?: () => void;
    onReset?: () => void;
    onToggleMessageHistory: () => void;
    onFinishFixing?: () => void;
    formatTime: (totalSeconds: number) => string;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
    userCode,
    timeRemaining,
    selectedGameTime,
    isRunning,
    unreadCount,
    onCodeChange,
    onGenerateFinalCode,
    onPauseResume,
    onReset,
    onToggleMessageHistory,
    onFinishFixing,
    formatTime,
}) => {
    const timeElapsed = selectedGameTime - timeRemaining;

    return (
        <div className={styles.gameLayout}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Court Room Challenge - Debugging</h1>
                    <p className={styles.studentNo}>Time Elapsed: {formatTime(timeElapsed)}</p>
                </div>
                <div className={styles.timerControls}>
                    <button
                        onClick={onToggleMessageHistory}
                        className={styles.messageIcon}
                        title="View Messages"
                    >
                        <svg className={styles.messageIconSvg} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className={styles.notificationBadge}>{unreadCount}</span>
                        )}
                    </button>
                    <div className={styles.timer}>
                        Time Remaining: <span className={styles.timerValue}>{formatTime(timeRemaining)}</span>
                    </div>
                    <div className={styles.controls}>
                        {onPauseResume && (
                            <button
                                onClick={onPauseResume}
                                className={styles.controlBtn}
                            >
                                {isRunning ? 'Pause' : 'Resume'}
                            </button>
                        )}
                        {onReset && (
                            <button
                                onClick={onReset}
                                className={styles.controlBtn}
                            >
                                Reset
                            </button>
                        )}
                        {onFinishFixing && (
                            <button
                                onClick={onFinishFixing}
                                className={styles.controlBtn}
                            >
                                Finish Fixing
                            </button>
                        )}
                        <button
                            onClick={onGenerateFinalCode}
                            className={`${styles.controlBtn} ${styles.endBtn}`}
                        >
                            SUBMIT
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.codeEditor}>
                    <h2 className={styles.panelTitle}>Buggy Code Editor</h2>
                    <textarea
                        value={userCode}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className={styles.codeArea}
                        spellCheck="false"
                        placeholder="Edit your code here..."
                    />
                </div>

                <div className={styles.previewPanel}>
                    <h2 className={styles.panelTitle}>Output Preview</h2>
                    <div className={styles.previewArea}>
                        <iframe
                            title="Code Preview"
                            srcDoc={userCode}
                            className={styles.iframe}
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPanel;