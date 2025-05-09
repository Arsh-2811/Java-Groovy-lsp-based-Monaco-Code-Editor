import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom/client';

import * as vscode from 'vscode';
import getKeybindingsServiceOverride
  from '@codingame/monaco-vscode-keybindings-service-override';
import {
  RegisteredFileSystemProvider,
  RegisteredMemoryFile,
  registerFileSystemOverlay
} from '@codingame/monaco-vscode-files-service-override';

// 1) This brings in Java syntax highlighting, grammars, etc.
import '@codingame/monaco-vscode-java-default-extension';

import helloJavaCode from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/examples/resources/eclipse.jdt.ls/workspace/hello.java?raw';
import { eclipseJdtLsConfig } from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/examples/src/eclipse.jdt.ls/config.js';

import {
  MonacoEditorReactComp,
  type MonacoEditorProps
} from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/wrapper-react/src/index.js';

// 3) Give Monaco real Web Workers:
import { configureDefaultWorkerFactory }
  from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/wrapper/src/workers/workerLoaders.js';

export default function App() {
  // Build up the in‐memory file so the LS can see “hello.java”
  useEffect(() => {
    const uri = vscode.Uri.file(
      `${eclipseJdtLsConfig.basePath}/workspace/hello.java`
    );
    const fsProvider = new RegisteredFileSystemProvider(false);
    fsProvider.registerFile(
      new RegisteredMemoryFile(uri, helloJavaCode)
    );
    registerFileSystemOverlay(1, fsProvider);
  }, []);

  const props: MonacoEditorProps = {
    style: { width: '100vw', height: '100vh' },
    wrapperConfig: {
      $type: 'extended',
      htmlContainer: undefined!,       // filled in by React wrapper
      logLevel: 'Debug',
      vscodeApiConfig: {
        // 2) override VS Code services for keybindings, etc.
        serviceOverrides: {
          ...getKeybindingsServiceOverride()
        },
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern'
          })
        }
      },
      editorAppConfig: {
        monacoWorkerFactory: configureDefaultWorkerFactory,
        codeResources: {
          modified: {
            text: helloJavaCode,
            uri: `${eclipseJdtLsConfig.basePath}/workspace/hello.java`
          }
        }
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
                uri: vscode.Uri.parse(
                  `${eclipseJdtLsConfig.basePath}/workspace`
                )
              }
            }
          }
        }
      }
    },
    onError: e => console.error('LSP startup failed', e),
    onLoad: wrapper => console.log('LSP started', wrapper)
  };

  return <MonacoEditorReactComp {...props} />;
}