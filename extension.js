const vscode = require("vscode");
const Imperial = require("imperial-node").Imperial;

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "imperial.uploadCode",
    function () {
      const config = vscode.workspace.getConfiguration("imperial");
      const editor = vscode.window.activeTextEditor;

      // Check if the editor is active
      if (!editor) return;

      // Get the text/code selected.
      const code = editor.document.getText(editor.selection);

      // Set API token
      const api = new Imperial(config.apiToken);

      // Document settings
      const documentSettings = {
        longerUrls: config.longerUrls || false,
        instantDelete: config.instantDelete || false,
        imageEmbed: config.imageEmbed || false,
        expiration: config.expiration || 5,
      };

      // Create the document with the document settings
      api.createDocument(code, documentSettings, (err, document) => {
        // If rate limited/internal server error
        if (err) {
          console.log(err);
          return vscode.window.showInformationMessage(
            "Upload failed! You're probably being rate limited!"
          );
        }

        console.log(document);
        // If succeeds
        vscode.window
          .showInformationMessage(
            `Upload succeeded! \n ${document.formattedLink}`,
            "Copy link",
            "Open document"
          )
          .then(async (selection) => {
            // If user selects copy link
            if (selection === "Copy link") {
              await vscode.env.clipboard.writeText(document.formattedLink);
            } else if (selection === "Open document") {
              // If user selects open document
              await vscode.commands.executeCommand(
                "vscode.open",
                vscode.Uri.parse(document.formattedLink)
              );
            }
          });
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
