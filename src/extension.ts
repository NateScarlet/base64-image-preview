import * as vscode from "vscode";

export function activate(ctx: vscode.ExtensionContext) {
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
          return new vscode.Hover(
            new vscode.MarkdownString(`![image](${match[0]})`)
          );
        }
      })()
    )
  );
}

export function deactivate() {}
