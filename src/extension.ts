import * as vscode from "vscode";

export function activate(ctx: vscode.ExtensionContext) {
  let base64image = '';

  vscode.commands.registerCommand('openLargeImage', () => {
    const panel = vscode.window.createWebviewPanel(
      'base64Image', 
      'Image Preview', 
      vscode.ViewColumn.One, 
      { enableScripts: false }
    );
    panel.webview.html = `<img src="${base64image}" style="max-width: 100%; max-height: 100vh; object-fit: contain;">`;

    // close the panel when it's no longer focused
    panel.onDidChangeViewState(e => {
      if (panel.visible === false) {
        panel.dispose();
      }
    });
  });

  ctx.subscriptions.push(
    vscode.languages.registerHoverProvider(
      "*",
      new (class implements vscode.HoverProvider {
        provideHover(
          document: vscode.TextDocument,
          position: vscode.Position,
          token: vscode.CancellationToken
        ): vscode.ProviderResult<vscode.Hover> {
          const line = document.getText(
            new vscode.Range(
              new vscode.Position(position.line, 0),
              new vscode.Position(position.line + 1, 0)
            )
          );
          const match = /data:image\/.+;base64,[a-zA-Z0-9+/=]+/.exec(line);
          if (!match) {
						return;
          }

          if (match[0].length > 100000) {
            base64image = match[0];
            const hoverMessage = new vscode.MarkdownString(`[Open Image in New Tab](command:openLargeImage)`);
            hoverMessage.isTrusted = true;
            return new vscode.Hover(hoverMessage);
          }
		
          return new vscode.Hover(
            new vscode.MarkdownString(`![image](${match[0]})`)
          );
        }
      })()
    )
  );
}

export function deactivate() {}
