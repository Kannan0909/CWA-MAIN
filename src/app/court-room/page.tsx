'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './court-room.module.css';
import { Message } from '../messages';
import { getDebuggingChallenges, EASY_CODE, MEDIUM_CODE, DIFFICULT_CODE, DISTRACTION_MESSAGES, TIME_OPTIONS } from '../../lib/gameData';
import GameSetup from '../components/gameSetup';
import CodeEditorPanel from '../components/codeEditorPanel';
import MessageCenter from '../components/messageCenter';
import GameOverlay from '../components/gameOverlay';

type GameState = 'welcome' | 'playing' | 'game_over';

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatMessageTime = (message: Message) => {
    return message.timestamp?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) || 'N/A';
};

const getMessagePriority = (message: Message): 'low' | 'medium' | 'high' | 'critical' => {
    if (message.isCritical) {
        if (message.messageType === 'urgent') return 'critical';
        return 'high';
    }
    if (message.source === 'Boss') return 'medium';
    return 'low';
};

const categorizeMessage = (message: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'>, currentGameTime: number): Message => {
    let messageType: 'initial' | 'urgent' | 'distraction' = 'distraction';

    if (message.isCritical) {
        messageType = message.text.toLowerCase().includes('urgent') ? 'urgent' : 'initial';
    }

    const categorized: Message = {
        ...message,
        messageType,
        timestamp: new Date(),
        gameTime: currentGameTime,
        priority: getMessagePriority({ ...message, messageType, timestamp: new Date(), gameTime: currentGameTime, priority: 'low' })
    };

    return categorized;
};

const CourtRoomPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('welcome');
    const [selectedGameTime, setSelectedGameTime] = useState(TIME_OPTIONS[1].time);
    const [timeRemaining, setTimeRemaining] = useState(selectedGameTime);
    const [isRunning, setIsRunning] = useState(false);
    const [penalties, setPenalties] = useState<string[]>([]);
    const [userCode, setUserCode] = useState('');
    const [generatedOutput, setGeneratedOutput] = useState('');
    const [activeTask, setActiveTask] = useState<string | null>(null);
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [showValidationResult, setShowValidationResult] = useState<{ isCorrect: boolean, message: string } | null>(null);
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [currentPopup, setCurrentPopup] = useState<Message | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [criticalQueue, setCriticalQueue] = useState<Message[]>([]);
    const [minorQueue, setMinorQueue] = useState<Message[]>([]);

    const [penaltyScreen, setPenaltyScreen] = useState<string | null>(null);
    const [processedChallenges, setProcessedChallenges] = useState<Set<string>>(new Set());
    const [distractionMessages, setDistractionMessages] = useState<Message[]>([]);
    const [lastDistractionTime, setLastDistractionTime] = useState<number>(0);
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [showFixFirstPopup, setShowFixFirstPopup] = useState(false);

    const getCurrentDifficulty = useCallback(() => {
        if (selectedGameTime === 120) return 'beginner';
        if (selectedGameTime === 300) return 'intermediate';
        if (selectedGameTime === 600) return 'advanced';
        return 'intermediate';
    }, [selectedGameTime]);

    const getCurrentChallenges = useCallback(() => {
        const difficulty = getCurrentDifficulty();
        const challenges = getDebuggingChallenges(selectedGameTime);
        return challenges[difficulty as keyof typeof challenges] || [];
    }, [getCurrentDifficulty, selectedGameTime]);

    const getCodeTemplateForDifficulty = useCallback(() => {
        const difficulty = getCurrentDifficulty();
        if (difficulty === 'beginner') return EASY_CODE;
        if (difficulty === 'intermediate') return MEDIUM_CODE;
        return DIFFICULT_CODE;
    }, [getCurrentDifficulty]);

    const resetGame = useCallback(() => {
        setGameState('welcome');
        setIsRunning(false);
        setPenalties([]);
        setTimeRemaining(selectedGameTime);
        setUserCode('');
        setCurrentMessages([]);
        setCurrentPopup(null);
        setUnreadCount(0);
        setCriticalQueue([]);
        setMinorQueue([]);
        setPenaltyScreen(null);
        setProcessedChallenges(new Set());
        setDistractionMessages([]);
        setLastDistractionTime(0);
        setShowWinPopup(false);
        setShowFixFirstPopup(false);
        setGeneratedOutput('');
        setActiveTask(null);
        setShowCodeEditor(false);
        setShowSolution(false);
        setShowValidationResult(null);
        setCompletedTasks(new Set());
    }, [selectedGameTime]);

    useEffect(() => {
        resetGame();
    }, [selectedGameTime, resetGame]);

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        return () => {
            // Clear any pending timeouts
            setShowValidationResult(null);
        };
    }, []);

    const handleStartGame = () => {
        setTimeRemaining(selectedGameTime);
        setUserCode('');
        setGameState('playing');
        setIsRunning(true);
        setShowCodeEditor(false);
        setActiveTask(null);
        setShowSolution(false);
        setShowValidationResult(null);
    };

    const isFixApplied = useCallback((penaltyKey: Message['penaltyKey']): boolean => {
        if (!userCode) return false;

        console.log('isFixApplied called with penaltyKey:', penaltyKey, 'userCode length:', userCode.length);

        switch (penaltyKey) {
            case 'DisabilityAct':
                console.log('Checking DisabilityAct - userCode:', userCode);
                const imgTags = userCode.match(/<img\b[^>]*>/gi) || [];
                console.log('Found img tags:', imgTags);
                if (imgTags.length === 0) return false;

                const imgsWithAlt = imgTags.filter(tag => {
                    const hasAltAttr = /\balt\s*=\s*(['"`])[^'"`]*\1/i.test(tag);
                    const altMatch = tag.match(/\balt\s*=\s*(['"`])([^'"`]*)\1/i);
                    const altContent = altMatch ? altMatch[2].trim() : '';
                    console.log('Tag:', tag, 'hasAltAttr:', hasAltAttr, 'altContent:', altContent);
                    return hasAltAttr && altContent.length > 0;
                });
                console.log('Images with alt:', imgsWithAlt.length, 'Total images:', imgTags.length);
                return imgsWithAlt.length === imgTags.length && imgTags.length > 0;

            case 'LawsOfTort_Validation':
                const codeLines = userCode.split('\n');
                let hasEmailValidation = false;

                for (const line of codeLines) {
                    const hasAtIncludes = /email[^}]*\.includes\s*\(\s*['"]@['"]\s*\)/i.test(line);
                    const hasDotIncludes = /email[^}]*\.includes\s*\(\s*['"]\.["']\s*\)/i.test(line);
                    const hasAtIndexOf = /email[^}]*\.indexOf\s*\(\s*['"]@['"]\s*\)/i.test(line);
                    const hasDotIndexOf = /email[^}]*\.indexOf\s*\(\s*['"]\.["']\s*\)/i.test(line);
                    const hasEmailRegex = /(\/[^\/]*@[^\/]*\.[^\/]*\/|new\s+RegExp|\.test\s*\(|\.match\s*\()/i.test(line) && /@.*\./i.test(line);
                    const hasCustomValidation = /function\s+\w*validate\w*email\w*/i.test(line) || /const\s+\w*validate\w*email\w*/i.test(line) || /email\s*[!=]==?\s*['"][^'"]*@[^'"]*\.[^'"]*['"]/i.test(line);
                    const hasBuiltInValidation = /type\s*=\s*['"]email['"]/i.test(line) || /pattern\s*=\s*['"][^'"]*@[^'"]*\.[^'"]*['"]/i.test(line);

                    if ((hasAtIncludes && hasDotIncludes) || (hasAtIndexOf && hasDotIndexOf) || hasEmailRegex || hasCustomValidation || hasBuiltInValidation) {
                        hasEmailValidation = true;
                        break;
                    }
                }

                const codeWithoutComments = userCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
                const hasConditionalValidation = /if\s*\([^)]*email[^)]*[@.][^)]*\)/i.test(codeWithoutComments) || /if\s*\([^)]*!email[^)]*includes[^)]*[@.]/i.test(codeWithoutComments);

                return hasEmailValidation || hasConditionalValidation;

            case 'Bankruptcy':
                const hasLoginButton = userCode.includes('id="loginBtn"');
                const isLoginButtonEnabled = !userCode.includes('disabled') || userCode.includes('onclick="login()"') || userCode.includes('onclick="login()"');
                const hasLoginFunction = /function\s+login\s*\(/i.test(userCode) || /onclick\s*=\s*["']login\(\)["']/i.test(userCode);

                return hasLoginButton && isLoginButtonEnabled && hasLoginFunction;

            case 'LawsOfTort_Database':
                const hasSecureDatabase = userCode.includes('secure database');
                const removedInsecureDatabase = !userCode.includes('insecure database');
                const hasSecurityMeasures = /secure|encrypt|hash|auth|token|ssl|https|bcrypt/i.test(userCode);
                const hasSecureConnection = /secure\s+(connection|database|storage)/i.test(userCode);

                return hasSecureDatabase && removedInsecureDatabase && (hasSecurityMeasures || hasSecureConnection);

            case 'PrivacyBreach':
                const hasPasswordInResponse = /password\s*:/i.test(userCode);
                const hasSecureAPI = !hasPasswordInResponse && /username\s*:/i.test(userCode);

                return hasSecureAPI && !hasPasswordInResponse;

            case 'SecurityNegligence':
                const hasCommentedAuth = /\/\/\s*if\s*\(\s*!isAuthenticated/i.test(userCode);
                const hasUncommentedAuth = /if\s*\(\s*!isAuthenticated/i.test(userCode) && !hasCommentedAuth;

                return hasUncommentedAuth && !hasCommentedAuth;

            default:
                return false;
        }
    }, [userCode]);

    const getChallengeStatus = useCallback(() => {
        const challenges = getCurrentChallenges();
        const difficulty = getCurrentDifficulty();

        // Only check the required number of challenges for each difficulty
        let requiredChallenges = challenges;
        if (difficulty === 'beginner') {
            requiredChallenges = challenges.slice(0, 1); // Only first 1 challenge
        } else if (difficulty === 'intermediate') {
            requiredChallenges = challenges.slice(0, 3); // Only first 3 challenges
        } else if (difficulty === 'advanced') {
            requiredChallenges = challenges.slice(0, 6); // All 6 challenges
        }

        console.log('getChallengeStatus - difficulty:', difficulty, 'requiredChallenges:', requiredChallenges.length);

        const status = requiredChallenges.map(challenge => {
            const isFixed = isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy' | 'PrivacyBreach' | 'SecurityNegligence');
            console.log('Challenge:', challenge.penaltyKey, 'isFixed:', isFixed);
            return {
                id: challenge.id,
                message: challenge.initialMessage,
                isFixed,
                penaltyKey: challenge.penaltyKey
            };
        });

        return status;
    }, [getCurrentChallenges, isFixApplied, getCurrentDifficulty]);

    const validateWinConditions = useCallback(() => {
        const challengeStatus = getChallengeStatus();
        const remainingIssues = challengeStatus
            .filter(status => !status.isFixed)
            .map(status => status.message);

        const canWin = remainingIssues.length === 0;
        return { canWin, remainingIssues };
    }, [getChallengeStatus]);

    const generateFinalCode = useCallback(async (isSubmissionAttempt = false) => {
        const { canWin } = validateWinConditions();
        const challengeStatus = getChallengeStatus();
        const resolvedChallenges = challengeStatus.filter(c => c.isFixed).length;
        const timeElapsed = selectedGameTime - timeRemaining;

        if (isSubmissionAttempt && !canWin) {
            setShowFixFirstPopup(true);
            return;
        }

        if (isSubmissionAttempt && canWin) {
            setIsRunning(false);
            setShowWinPopup(true);
        }

        if (gameState === 'playing' && !isSubmissionAttempt || (timeRemaining === 0 && !canWin)) {
            setIsRunning(false);
            setGameState('game_over');
        }

        const isSuccessfulCompletion = canWin && isSubmissionAttempt;
        const completionStatus = isSuccessfulCompletion ? 'SUCCESS' : 'INCOMPLETE';

        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSE3CWA Generated Code - ${completionStatus}</title>
</head>
<body>
    ${userCode}
    
    <script>
        const altFixStatus = document.body.innerHTML.includes('alt="');
        const emailValidationStatus = document.body.innerHTML.includes('@') && document.body.innerHTML.includes('.');
        const securityFixStatus = document.body.innerHTML.includes('secure database');
        
        console.log('=== Court Room Challenge Results ===');
        console.log('Game Completion Status:', '${completionStatus}');
        console.log('Alt Tag Accessibility Fix:', altFixStatus ? 'FIXED' : 'MISSING');
        console.log('Email Validation Fix:', emailValidationStatus ? 'FIXED' : 'MISSING');
        console.log('Security Database Fix:', securityFixStatus ? 'FIXED' : 'MISSING');
        console.log('All Issues Resolved:', ${isSuccessfulCompletion});
        console.log('=====================================');
    </script>
</body>
</html>
        `.trim();

        setGeneratedOutput(finalHtml);

        try {
            console.log('Attempting to save result to API...');

            const response = await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    generatedCode: finalHtml,
                    penalties: penalties,
                    timeTaken: timeElapsed,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Game result saved successfully! ID:', data.id);
            } else {
                console.error('Failed to save game result to API:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error saving result:', error);
        }
    }, [validateWinConditions, isRunning, selectedGameTime, timeRemaining, userCode, penalties, gameState, getChallengeStatus]);

    const addToPopupQueue = useCallback((message: Message) => {
        if (message.priority === 'critical') {
            setCriticalQueue(prev => [...prev, message]);
        } else {
            setMinorQueue(prev => [...prev, message]);
        }
    }, []);

    const handleClosePopup = useCallback(() => {
        setCurrentPopup(null);
        if (criticalQueue.length > 0) {
            const nextMessage = criticalQueue[0];
            setCriticalQueue(prev => prev.slice(1));
            setCurrentPopup(nextMessage);
        } else if (minorQueue.length > 0) {
            const nextMessage = minorQueue[0];
            setMinorQueue(prev => prev.slice(1));
            setCurrentPopup(nextMessage);
        }
    }, [criticalQueue, minorQueue]);


    const handleCloseFixFirstPopup = () => {
        setShowFixFirstPopup(false);
    };

    const handleStartFixing = (taskId: string) => {
        setActiveTask(taskId);
        setShowCodeEditor(true);
        setUserCode(getCodeTemplateForDifficulty());
        // Close the current popup when starting to fix
        setCurrentPopup(null);
        // Remove from critical queue if it was there
        setCriticalQueue(prev => prev.filter(m => m.penaltyKey !== taskId));
        setMinorQueue(prev => prev.filter(m => m.penaltyKey !== taskId));
    };

    const handleFinishFixing = () => {
        setActiveTask(null);
        setShowCodeEditor(false);
        setUserCode('');
        setShowSolution(false);
        setShowValidationResult(null);
        // Clear any pending timeouts to prevent memory leaks
        setTimeout(() => {
            setShowValidationResult(null);
        }, 0);
    };

    const handleSaveResults = async () => {
        try {
            const gameResults = {
                difficulty: getCurrentDifficulty(),
                timeTaken: selectedGameTime - timeRemaining,
                completedTasks: Array.from(completedTasks),
                totalTasks: getCurrentDifficulty() === 'beginner' ? 1 : getCurrentDifficulty() === 'intermediate' ? 3 : 6,
                penalties: penalties,
                finalCode: userCode,
                gameState: gameState,
                timestamp: new Date().toISOString()
            };

            const response = await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameResults),
            });

            if (response.ok) {
                console.log('Game results saved successfully!');
                alert('Game results saved to database!');
            } else {
                console.error('Failed to save results');
                alert('Failed to save results');
            }
        } catch (error) {
            console.error('Error saving results:', error);
            alert('Error saving results');
        }
    };

    const handleCompleteTask = () => {
        if (!activeTask) return;

        // Simple approach: mark task as completed when user clicks Complete
        setCompletedTasks(prev => new Set([...prev, activeTask]));

        const message = 'Correct! You successfully fixed the issue.';
        setShowValidationResult({ isCorrect: true, message });

        // Remove the task from penalties if it was there
        setPenalties(prev => prev.filter(p => p !== activeTask));

        // Return to blank screen after correct answer
        setTimeout(() => {
            setActiveTask(null);
            setShowCodeEditor(false);
            setUserCode('');
            setShowSolution(false);
            setShowValidationResult(null);
        }, 2000); // Wait 2 seconds to show the success message
    };

    const handleShowSolution = () => {
        setShowSolution(true);
        // Replace the user code with the solution code
        setUserCode(getSolutionCode());
        // Add penalty for using solution
        setPenalties(prev => [...prev, 'Solution Used']);
    };

    const getSolutionCode = () => {
        if (!activeTask) return '';

        // Return the solution based on the active task
        switch (activeTask) {
            case 'DisabilityAct':
                return getCodeTemplateForDifficulty().replace(
                    /<img([^>]*?)>/gi,
                    '<img$1 alt="Descriptive text for accessibility">'
                );
            case 'LawsOfTort_Validation':
                return getCodeTemplateForDifficulty().replace(
                    /<input([^>]*?)>/gi,
                    (match) => {
                        if (match.includes('type="text"') && match.includes('id="email"')) {
                            return match.replace('type="text"', 'type="email" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"');
                        }
                        return match;
                    }
                );
            case 'Bankruptcy':
                return getCodeTemplateForDifficulty().replace(
                    '<button id="loginBtn" disabled>Login</button>',
                    '<button id="loginBtn" onclick="login()">Login</button>'
                );
            case 'LawsOfTort_Database':
                return getCodeTemplateForDifficulty().replace(
                    'insecure database',
                    'secure database with encryption'
                ).replace(
                    'console.log(\'Saving data to insecure database...\');',
                    'console.log(\'Saving data to secure database with encryption...\');'
                );
            case 'PrivacyBreach':
                return getCodeTemplateForDifficulty().replace(
                    /{ username: "[^"]*", password: "[^"]*" }/g,
                    '{ username: "alex" }'
                ).replace(
                    /{ username: "[^"]*", password: "[^"]*" }/g,
                    '{ username: "sam" }'
                );
            case 'SecurityNegligence':
                return getCodeTemplateForDifficulty().replace(
                    '// if (!isAuthenticated(user)) {\n  //   throw new Error("Unauthorized access");\n  // }',
                    'if (!isAuthenticated(user)) {\n    throw new Error("Unauthorized access");\n  }'
                );
            default:
                return getCodeTemplateForDifficulty();
        }
    };

    const handlePauseResume = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        resetGame();
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined = undefined;

        if (isRunning && timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            setIsRunning(false);

            // Simple win condition based on completed tasks
            const difficulty = getCurrentDifficulty();
            let requiredTasks = 0;
            if (difficulty === 'beginner') requiredTasks = 1;
            else if (difficulty === 'intermediate') requiredTasks = 3;
            else if (difficulty === 'advanced') requiredTasks = 6;

            const hasWon = completedTasks.size >= requiredTasks;

            if (hasWon) {
                // All required tasks completed - show congratulations
                setShowWinPopup(true);
            } else {
                // Time up with incomplete tasks - show penalty
                const penaltyMessages = {
                    'DisabilityAct': 'VIOLATION: Disabilities Act - Missing alt attributes on images create accessibility barriers for visually impaired users.',
                    'LawsOfTort_Validation': 'VIOLATION: Laws of Tort - Inadequate input validation exposes the system to malicious data and potential security breaches.',
                    'Bankruptcy': 'VIOLATION: Bankruptcy Code - Disabled login functionality prevents user access and violates service agreements.',
                    'LawsOfTort_Database': 'VIOLATION: Laws of Tort - Insecure database connections expose sensitive user data to unauthorized access.',
                    'PrivacyBreach': 'VIOLATION: Privacy Breach - Exposing user passwords in API responses violates data protection regulations.',
                    'SecurityNegligence': 'VIOLATION: Security Negligence - Commented out authentication checks create critical security vulnerabilities.'
                };

                // Show penalty for first missing task
                const penaltyMessage = 'VIOLATION: Code quality standards not met.';
                setPenaltyScreen(penaltyMessage);
                setGameState('game_over');
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, timeRemaining, gameState, validateWinConditions, getCurrentChallenges, isFixApplied]);

    useEffect(() => {
        if (gameState !== 'playing' || !isRunning || penaltyScreen) return;

        const elapsedTime = selectedGameTime - timeRemaining;
        const challenges = getCurrentChallenges();

        const getNextSafeDistractionTime = (currentTime: number): number => {
            const bufferZone = 5;
            let nextSafeTime = currentTime + 1;

            while (nextSafeTime <= selectedGameTime) {
                const isConflict = challenges.some(challenge => {
                    return Math.abs(nextSafeTime - challenge.initialTime) < bufferZone ||
                        Math.abs(nextSafeTime - challenge.urgentTime) < bufferZone ||
                        Math.abs(nextSafeTime - challenge.penaltyTime) < bufferZone;
                });

                if (!isConflict) {
                    return nextSafeTime;
                }
                nextSafeTime++;
            }

            return -1;
        };

        const getDistractionFrequencyForDifficulty = (difficulty: string, gameTime: number): { interval: number, maxCount: number } => {
            switch (difficulty) {
                case 'beginner':
                    return { interval: Math.max(20, Math.floor(gameTime * 0.33)), maxCount: 2 };
                case 'intermediate':
                    return { interval: Math.max(12, Math.floor(gameTime * 0.08)), maxCount: Math.floor(gameTime / 15) };
                case 'advanced':
                    return { interval: Math.max(7, Math.floor(gameTime * 0.025)), maxCount: Math.floor(gameTime / 8) };
                default:
                    return { interval: 15, maxCount: 5 };
            }
        };

        challenges.forEach(challenge => {
            const challengeKey = `${challenge.id}_${challenge.initialTime}`;
            const isCurrentlyFixed = isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy');

            if (elapsedTime >= challenge.initialTime && !processedChallenges.has(`${challengeKey}_initial`)) {
                const message: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                    id: challenge.initialTime,
                    source: 'Ethical/Legal',
                    text: challenge.initialMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy',
                };

                const categorizedMessage = categorizeMessage(message, elapsedTime);
                setCurrentMessages(prev => [...prev, categorizedMessage]);
                setMessageHistory(prev => [...prev, categorizedMessage]);
                setUnreadCount(prev => prev + 1);
                currentPopup ? addToPopupQueue(categorizedMessage) : setCurrentPopup(categorizedMessage);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_initial`]));
            }

            if (isCurrentlyFixed && processedChallenges.has(`${challengeKey}_initial`) && !processedChallenges.has(`${challengeKey}_urgent`)) {
                setCriticalQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                setMinorQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`, `${challengeKey}_penalty`]));
            }

            if (elapsedTime >= challenge.urgentTime &&
                !processedChallenges.has(`${challengeKey}_urgent`) &&
                !isCurrentlyFixed) {

                const message: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                    id: challenge.urgentTime,
                    source: 'Ethical/Legal',
                    text: challenge.urgentMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy',
                };

                const categorizedMessage = categorizeMessage(message, elapsedTime);
                setCurrentMessages(prev => [...prev, categorizedMessage]);
                setMessageHistory(prev => [...prev, categorizedMessage]);
                setUnreadCount(prev => prev + 1);
                addToPopupQueue(categorizedMessage);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
            }

            if (elapsedTime >= challenge.penaltyTime &&
                !processedChallenges.has(`${challengeKey}_penalty`) &&
                !isCurrentlyFixed) {

                setPenaltyScreen(challenge.penaltyMessage);
                setPenalties(prev => [...prev, challenge.penaltyKey]);
                setIsRunning(false);
                setGameState('game_over');

                const penaltyMessage: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                    id: challenge.penaltyTime,
                    source: 'Court Order',
                    text: `PENALTY: ${challenge.penaltyMessage}`,
                    isCritical: true,
                    penaltyKey: 'PENALTY',
                };
                setMessageHistory(prev => [...prev, categorizeMessage(penaltyMessage, elapsedTime)]);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
            }
        });

        const difficulty = getCurrentDifficulty();
        const { interval, maxCount } = getDistractionFrequencyForDifficulty(difficulty, selectedGameTime);
        const nextSafeTime = getNextSafeDistractionTime(elapsedTime);

        const shouldGenerateDistraction =
            (elapsedTime - lastDistractionTime >= interval) &&
            distractionMessages.length < maxCount &&
            nextSafeTime > elapsedTime && nextSafeTime !== -1;

        if (shouldGenerateDistraction) {
            const randomMessageIndex = Math.floor(Math.random() * DISTRACTION_MESSAGES.length);
            const distractionData = DISTRACTION_MESSAGES[randomMessageIndex];

            const distractionMessage: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                id: elapsedTime,
                source: distractionData.source,
                text: distractionData.text,
                isCritical: false,
                penaltyKey: 'Distraction',
            };

            const categorizedMessage = categorizeMessage(distractionMessage, elapsedTime);
            setCurrentMessages(prev => [...prev, categorizedMessage]);
            setMessageHistory(prev => [...prev, categorizedMessage]);
            setUnreadCount(prev => prev + 1);
            setDistractionMessages(prev => [...prev, categorizedMessage]);
            setLastDistractionTime(elapsedTime);

            currentPopup ? addToPopupQueue(categorizedMessage) : setCurrentPopup(categorizedMessage);
        }
    }, [gameState, isRunning, timeRemaining, selectedGameTime, penalties, processedChallenges, currentPopup, lastDistractionTime, getCurrentChallenges, getCurrentDifficulty, isFixApplied, addToPopupQueue, penaltyScreen, distractionMessages.length]);

    return (
        <div className={`${styles.gameContainer} ${gameState === 'playing' ? styles.playing : ''} ${penaltyScreen ? styles.penalty : ''}`}>
            <GameOverlay
                gameState={gameState}
                penaltyScreen={penaltyScreen}
                showWinPopup={showWinPopup}
                showFixFirstPopup={showFixFirstPopup}
                selectedGameTime={selectedGameTime}
                timeRemaining={timeRemaining}
                penalties={penalties}
                onClosePenalty={() => { setPenaltyScreen(null); resetGame(); }}
                onResetGame={() => { setShowWinPopup(false); resetGame(); }}
                onGenerateFinalCode={() => generateFinalCode(false)}
                getCurrentDifficulty={getCurrentDifficulty}
                getChallengeStatus={getChallengeStatus}
                formatTime={formatTime}
                onCloseFixFirstPopup={handleCloseFixFirstPopup}
                onSaveResults={handleSaveResults}
            />

            {gameState === 'welcome' && (
                <GameSetup
                    selectedGameTime={selectedGameTime}
                    onSelectTime={setSelectedGameTime}
                    onStartGame={handleStartGame}
                />
            )}

            {(gameState === 'playing' || gameState === 'game_over') && !penaltyScreen && (
                <div className={styles.gameLayout}>
                    {/* Always show header */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <h1 className={styles.title}>Court Room Challenge - Debugging</h1>
                        </div>
                        <div className={styles.timerControls}>
                            <div className={styles.timer}>
                                Time Remaining: <span className={styles.timerValue}>{formatTime(timeRemaining)}</span>
                            </div>
                            <div className={styles.controls} style={{ gap: '4px' }}>
                                <button
                                    onClick={handlePauseResume}
                                    className={styles.controlBtn}
                                >
                                    {isRunning ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className={styles.controlBtn}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main content area - only show when fixing */}
                    {showCodeEditor && (
                        <div className={styles.mainContent}>
                            <div className={styles.codeEditor}>
                                <h2 className={styles.panelTitle}>Code Editor</h2>
                                <textarea
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    className={styles.codeArea}
                                    spellCheck="false"
                                />
                                <div className={styles.editorControls}>
                                    <button
                                        onClick={handleShowSolution}
                                        className={styles.solutionBtn}
                                        disabled={showSolution}
                                    >
                                        {showSolution ? 'Solution Applied' : 'Show Solution'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.previewPanel}>
                                <h2 className={styles.panelTitle}>Output Preview</h2>
                                <div className={styles.previewArea}>
                                    <iframe
                                        title="Code Preview"
                                        srcDoc={userCode || '<div>No code to preview</div>'}
                                        className={styles.iframe}
                                    />
                                </div>
                                {activeTask && (
                                    <div className={styles.previewControls}>
                                        <button
                                            onClick={handleCompleteTask}
                                            className={styles.completeBtn}
                                        >
                                            Complete
                                        </button>
                                    </div>
                                )}
                                {showValidationResult && (
                                    <div className={`${styles.validationResult} ${showValidationResult.isCorrect ? styles.correctResult : styles.incorrectResult}`}>
                                        <p className={styles.validationMessage}>{showValidationResult.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <MessageCenter
                        currentPopup={currentPopup}
                        messageHistory={messageHistory}
                        showMessageHistory={false}
                        formatMessageTime={formatMessageTime}
                        onClosePopup={handleClosePopup}
                        onToggleHistory={() => { }}
                        onStartFixing={handleStartFixing}
                        activeTask={activeTask}
                    />
                </div>
            )}
        </div>
    );
};

export default CourtRoomPage;