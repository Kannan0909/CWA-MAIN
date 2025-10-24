import React from 'react';
import styles from '../court-room/court-room.module.css';

interface ChallengeStatus {
    id: string;
    message: string;
    isFixed: boolean;
    penaltyKey: string;
}

interface GameOverlayProps {
    gameState: 'welcome' | 'playing' | 'game_over';
    penaltyScreen: string | null;
    showWinPopup: boolean;
    showFixFirstPopup: boolean;
    selectedGameTime: number;
    timeRemaining: number;
    penalties: string[];
    onClosePenalty: () => void;
    onResetGame: () => void;
    onGenerateFinalCode: () => void;
    getCurrentDifficulty: () => 'beginner' | 'intermediate' | 'advanced';
    getChallengeStatus: () => ChallengeStatus[];
    formatTime: (totalSeconds: number) => string;
    onCloseFixFirstPopup: () => void;
    onSaveResults: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
    gameState,
    penaltyScreen,
    showWinPopup,
    showFixFirstPopup,
    selectedGameTime,
    timeRemaining,
    penalties,
    onClosePenalty,
    onResetGame,
    onGenerateFinalCode,
    getCurrentDifficulty,
    getChallengeStatus,
    formatTime,
    onCloseFixFirstPopup,
    onSaveResults
}) => {
    const timeTaken = selectedGameTime - timeRemaining;
    const challenges = getChallengeStatus();
    const resolvedChallenges = challenges.filter(c => c.isFixed).length;

    const formatDifficulty = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'Beginner';
            case 'intermediate': return 'Intermediate';
            case 'advanced': return 'Advanced';
            default: return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        }
    };

    if (penaltyScreen) {
        return (
            <div className={styles.penaltyOverlay}>
                <div className={styles.courtRoomPenalty}>
                    <div className={styles.judgeSection}>
                        <div className={styles.penaltyContent}>
                            <h1 className={styles.penaltyTitle}>COURT ORDER</h1>
                            <h2 className={styles.penaltySubtitle}>PENALTY ISSUED</h2>
                            <div className={styles.penaltyText}>
                                <p className={styles.penaltyMessage}>{penaltyScreen}</p>
                            </div>
                            <div className={styles.penaltyActions}>
                                <button
                                    onClick={onSaveResults}
                                    className={styles.saveResultsBtn}
                                >
                                    Save Results
                                </button>
                                <button
                                    onClick={onClosePenalty}
                                    className={styles.penaltyAcknowledgeBtn}
                                >
                                    ACKNOWLEDGE PENALTY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'game_over' && !showWinPopup) {
        return (
            <div className={styles.overlay}>
                <div className={styles.gameOverBox}>
                    <h2 className={styles.gameOverHeader}>TIME EXPIRED</h2>
                    <h1 className={styles.gameOverTitle}>Game Over</h1>
                    <p className={styles.gameOverMessage}>
                        You failed to fix all bugs before the time ran out.
                    </p>
                    <ul className={styles.finalStats}>
                        <li>Difficulty: {formatDifficulty(getCurrentDifficulty())}</li>
                        <li>Time Elapsed: {formatTime(timeTaken)}</li>
                        <li>Issues Fixed: {resolvedChallenges} / {challenges.length}</li>
                        <li>Total Penalties: {penalties.length}</li>
                    </ul>
                    <button
                        onClick={onResetGame}
                        className={styles.controlBtn}
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    if (showWinPopup) {
        return (
            <div className={styles.overlay}>
                <div className={styles.winBox}>
                    <h2 className={styles.winHeader}>SUCCESS!</h2>
                    <h1 className={styles.winTitle}>Congratulations!!</h1>
                    <p className={styles.winMessage}>
                        A good day at the office
                    </p>
                    <div className={styles.popupActions}>
                        <button
                            onClick={onSaveResults}
                            className={styles.saveResultsBtn}
                        >
                            Save Results
                        </button>
                        <button
                            onClick={onResetGame}
                            className={styles.controlBtn}
                        >
                            Play New Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showFixFirstPopup) {
        return (
            <div className={styles.overlay}>
                <div className={styles.fixFirstBox}>
                    <h2 className={styles.fixFirstHeader}>REMAINING ISSUES</h2>
                    <p className={styles.fixFirstMessage}>
                        You must fix ALL legal and ethical violations before submitting.
                    </p>
                    <ul className={styles.fixList}>
                        {challenges.filter(c => !c.isFixed).map(c => (
                            <li key={c.id}>{c.message}</li>
                        ))}
                    </ul>
                    <button
                        onClick={onCloseFixFirstPopup}
                        className={styles.popupOkBtn}
                    >
                        Back to Coding
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default GameOverlay;