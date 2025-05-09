/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { RegisteredFileSystemProvider, RegisteredMemoryFile, registerFileSystemOverlay } from '@codingame/monaco-vscode-files-service-override';
// this is required syntax highlighting
import '@codingame/monaco-vscode-java-default-extension';
import { LogLevel } from '@codingame/monaco-vscode-api';
import { MonacoEditorLanguageClientWrapper, type WrapperConfig } from 'monaco-editor-wrapper';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';
import { eclipseJdtLsConfig } from '../config.js';
import helloJavaCode from '../../../resources/eclipse.jdt.ls/workspace/hello.java?raw';

export const runEclipseJdtLsClient = async () => {
    const helloJavaUri = vscode.Uri.file(`${eclipseJdtLsConfig.basePath}/workspace/hello.java`);
    const fileSystemProvider = new RegisteredFileSystemProvider(false);
    fileSystemProvider.registerFile(new RegisteredMemoryFile(helloJavaUri, helloJavaCode));
    registerFileSystemOverlay(1, fileSystemProvider);

    const wrapperConfig: WrapperConfig = {
        $type: 'extended',
        htmlContainer: document.getElementById('monaco-editor-root')!,
        logLevel: LogLevel.Debug,
        vscodeApiConfig: {
            serviceOverrides: {
                ...getKeybindingsServiceOverride(),
            },
            userConfiguration: {
                json: JSON.stringify({
                    'workbench.colorTheme': 'Default Dark Modern',
                    'editor.guides.bracketPairsHorizontal': 'active',
                    'editor.wordBasedSuggestions': 'off',
                    'editor.experimental.asyncTokenization': true
                })
            }
        },
        editorAppConfig: {
            codeResources: {
                modified: {
                    text: helloJavaCode,
                    uri: `${eclipseJdtLsConfig.basePath}/workspace/hello.java`
                }
            },
            monacoWorkerFactory: configureDefaultWorkerFactory
        },
        languageClientConfigs: {
            configs: {
                java: {
                    connection: {
                        options: {
                            $type: 'WebSocketUrl',
                            url: 'ws://localhost:30003/jdtls'
                        }
                    },
                    clientOptions: {
                        documentSelector: ['java'],
                        workspaceFolder: {
                            index: 0,
                            name: 'workspace',
                            uri: vscode.Uri.parse(`${eclipseJdtLsConfig.basePath}/workspace`)
                        }
                    }
                }
            }
        }
    };

    const wrapper = new MonacoEditorLanguageClientWrapper();

    try {
        await wrapper.init(wrapperConfig);
        await vscode.workspace.openTextDocument(helloJavaUri);
        await wrapper.start();
        
        window.addEventListener('beforeunload', () => {
            wrapper.dispose().catch(console.error);
        });
        
    } catch (e) {
        console.error(e);
    }
};
