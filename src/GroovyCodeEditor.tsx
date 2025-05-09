import React, { useEffect } from 'react';

import * as vscode from 'vscode';
import getKeybindingsServiceOverride
  from '@codingame/monaco-vscode-keybindings-service-override';
import {
  RegisteredFileSystemProvider,
  RegisteredMemoryFile,
  registerFileSystemOverlay
} from '@codingame/monaco-vscode-files-service-override';

import '@codingame/monaco-vscode-groovy-default-extension';

const helloGroovyCode = `package test.org;
import java.io.File;
File file = new File("E:/Example.txt");
`;
import { groovyConfig } from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/examples/src/groovy/config.js';

import {
  MonacoEditorReactComp,
  type MonacoEditorProps
} from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/wrapper-react/src/index.js';

import { configureDefaultWorkerFactory } from '/home/arsh/Java-Groovy-lsp-based-Monaco-Code-Editor/packages/wrapper/src/workers/workerLoaders.js';

export default function App() {
  useEffect(() => {
    const uri = vscode.Uri.file(
      `${groovyConfig.basePath}/workspace/hello.groovy`
    );
    const fsProvider = new RegisteredFileSystemProvider(false);
    fsProvider.registerFile(
      new RegisteredMemoryFile(uri, helloGroovyCode)
    );
    registerFileSystemOverlay(1, fsProvider);
  }, []);

  const props: MonacoEditorProps = {
    style: { width: '100vw', height: '100vh' },
    wrapperConfig: {
      $type: 'extended',
      htmlContainer: undefined!,
      logLevel: 2,
      vscodeApiConfig: {
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
            text: helloGroovyCode,
            uri: `${groovyConfig.basePath}/workspace/hello.groovy`
          }
        }
      },
      languageClientConfigs: {
        configs: {
          groovy: {
            connection: {
              options: {
                $type: 'WebSocketUrl',
                url: 'ws://localhost:30002/groovy' 
              }
            },
            clientOptions: {
              documentSelector: ['groovy'],
              workspaceFolder: {
                index: 0,
                name: 'workspace',
                uri: vscode.Uri.parse(
                  `${groovyConfig.basePath}/workspace`
                )
              }
            }
          }
        }
      }
    },
    onError: e => console.error('Groovy LSP failed to start', e),
    onLoad: wrapper => console.log('Groovy LSP started', wrapper)
  };

  return <MonacoEditorReactComp {...props} />;
}
