/**
 * DialogSystem - Handles story conversations and narrative moments
 */
export class DialogSystem {
    constructor() {
        this.isShowing = false;
        this.currentDialog = null;
        this.callback = null;
        this.typewriterSpeed = 50; // ms per character
        this.typewriterInterval = null;
        this.currentText = '';
        this.targetText = '';
        this.skipRequested = false;

        this.createDialogElements();
        this.setupEventListeners();
    }

    createDialogElements() {
        // Create dialog container
        this.dialogContainer = document.createElement('div');
        this.dialogContainer.id = 'dialogContainer';
        this.dialogContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,20,0.9));
            border-top: 3px solid #00ffff;
            display: none;
            z-index: 1000;
            padding: 20px;
            font-family: 'Courier New', monospace;
        `;

        // Create portrait area
        this.portrait = document.createElement('div');
        this.portrait.style.cssText = `
            position: absolute;
            left: 20px;
            top: 20px;
            width: 100px;
            height: 100px;
            border: 2px solid #00ffff;
            border-radius: 10px;
            background: rgba(0,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        `;

        // Create speaker name
        this.speakerName = document.createElement('div');
        this.speakerName.style.cssText = `
            position: absolute;
            left: 140px;
            top: 20px;
            font-size: 20px;
            color: #00ffff;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;

        // Create dialog text
        this.dialogText = document.createElement('div');
        this.dialogText.style.cssText = `
            position: absolute;
            left: 140px;
            top: 50px;
            right: 120px;
            font-size: 16px;
            color: white;
            line-height: 1.5;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        `;

        // Create continue prompt
        this.continuePrompt = document.createElement('div');
        this.continuePrompt.style.cssText = `
            position: absolute;
            right: 20px;
            bottom: 20px;
            font-size: 14px;
            color: #00ffff;
            animation: pulse 1s infinite;
        `;
        this.continuePrompt.textContent = '▶ Press SPACE or click to continue';

        // Assemble dialog
        this.dialogContainer.appendChild(this.portrait);
        this.dialogContainer.appendChild(this.speakerName);
        this.dialogContainer.appendChild(this.dialogText);
        this.dialogContainer.appendChild(this.continuePrompt);

        document.body.appendChild(this.dialogContainer);
    }

    setupEventListeners() {
        // Handle continue on click or keypress
        const handleContinue = () => {
            if (this.isShowing) {
                if (this.typewriterInterval) {
                    // Skip typewriter effect
                    this.skipRequested = true;
                } else {
                    // Close dialog
                    this.hide();
                }
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isShowing) {
                e.preventDefault();
                handleContinue();
            }
        });

        this.dialogContainer.addEventListener('click', handleContinue);
    }

    /**
     * Show a dialog with typewriter effect
     * @param {string} speaker - Name of the speaker
     * @param {string} message - Dialog text
     * @param {string} portrait - Emoji or character for portrait
     * @param {function} callback - Called when dialog is closed
     */
    show(speaker, message, portrait = '👤', callback = null) {
        // If dialog is already showing, queue this one for later
        if (this.isShowing) {
            // Force close current dialog and show new one
            this.hide();
            // Small delay to prevent visual glitches
            setTimeout(() => {
                this.show(speaker, message, portrait, callback);
            }, 100);
            return;
        }

        this.isShowing = true;
        this.callback = callback;
        this.currentText = '';
        this.targetText = message;
        this.skipRequested = false;

        // Set speaker info
        this.speakerName.textContent = speaker;
        this.portrait.textContent = portrait;
        this.dialogText.textContent = '';

        // Show container
        this.dialogContainer.style.display = 'block';
        this.continuePrompt.style.display = 'none';

        // Start typewriter effect
        this.startTypewriter();
    }

    startTypewriter() {
        let charIndex = 0;

        this.typewriterInterval = setInterval(() => {
            if (this.skipRequested || charIndex >= this.targetText.length) {
                // Complete the text
                this.dialogText.textContent = this.targetText;
                this.completeTypewriter();
                return;
            }

            // Add next character
            this.currentText += this.targetText[charIndex];
            this.dialogText.textContent = this.currentText;
            charIndex++;

        }, this.typewriterSpeed);
    }

    completeTypewriter() {
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        this.continuePrompt.style.display = 'block';
    }

    hide() {
        if (!this.isShowing) return;

        this.isShowing = false;
        this.dialogContainer.style.display = 'none';

        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        // Call callback if provided
        if (this.callback) {
            const cb = this.callback;
            this.callback = null;
            cb();
        }
    }

    /**
     * Show a sequence of dialogs
     * @param {Array} dialogs - Array of {speaker, message, portrait} objects
     * @param {function} callback - Called when all dialogs are complete
     */
    showSequence(dialogs, callback = null) {
        if (dialogs.length === 0) {
            if (callback) callback();
            return;
        }

        const [first, ...rest] = dialogs;
        this.show(first.speaker, first.message, first.portrait, () => {
            this.showSequence(rest, callback);
        });
    }

    /**
     * Quick message without portrait
     * @param {string} message - Message to show
     * @param {function} callback - Called when closed
     */
    showQuickMessage(message, callback = null) {
        this.show('System', message, '📡', callback);
    }
}