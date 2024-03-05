import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gitbot.helloWorld', () => {
        // Start the chatbot script
        const chatbotProcess = exec(`python3 /Users/sumanthkrishnapalagudi/Desktop/GenAi/chatbot/gitbot/src/backend/chatbot.py`);

        // Listen for chatbot output
        chatbotProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            // Check if the output indicates a prompt from the chatbot
            if (output.includes('Please enter') || output.includes('Enter')) {
                // Prompt the user for input
                vscode.window.showInputBox({ prompt: output }).then((userInput) => {
                    if (userInput !== undefined) {
                        // Send user input to the chatbot
                        chatbotProcess.stdin?.write(`${userInput}\n`);
                    }
                });
            } else {
                // Display chatbot output to the user
                vscode.window.showInformationMessage(output);
            }
        });

        // Handle chatbot process exit
        chatbotProcess.on('exit', (code) => {
            console.log(`Chatbot process exited with code ${code}`);
        });

        // Handle errors
        chatbotProcess.on('error', (error) => {
            console.error(`Error executing chatbot script: ${error.message}`);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
