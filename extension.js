const vscode = require("vscode");
const Imperial = require("imperial-node").Imperial;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  /* Rawr x3 nuzzles how are you pounces on you you're so warm o3o notices you
  have a bulge o: someone's happy ;) nuzzles your necky wecky~ murr~ hehehe
  rubbies your bulgy wolgy you're so big :oooo rubbies more on your bulgy wolgy
  it doesn't stop growing ·///· kisses you and lickies your necky daddy likies
  (; nuzzles wuzzles I hope daddy really likes $: wiggles butt and squirms I
  want to see your big daddy meat~ wiggles butt I have a little itch o3o wags
  tail can you please get my itch~ puts paws on your chest nyea~ its a seven
  inch itch rubs your chest can you help me pwease squirms pwetty pwease sad
  face I need to be punished runs paws down your chest and bites lip like I need
  to be punished really good~ paws on your bulge as I lick my lips I'm getting
  thirsty. I can go for some milk unbuttons your pants as my eyes glow you smell
  so musky :v licks shaft mmmm~ so musky drools all over your cock your daddy
  meat I like fondles Mr. Fuzzy Balls hehe puts snout on balls and inhales
  deeply oh god im so hard~ licks balls punish me daddy~ nyea~ squirms more and
  wiggles butt I love your musky goodness bites lip please punish me licks lips
  nyea~ suckles on your tip so good licks pre of your cock salty goodness~ eyes
  role back and goes balls deep mmmm~ moans and suckles o3o
  */
 
  const disposable = vscode.commands.registerCommand(
    "imperial.uploadCode",
    () => {
      const config = vscode.workspace.getConfiguration("imperial");
      const editor = vscode.window.activeTextEditor;
      // where da editor go?
      if (!editor) return;
      // Current highlighted code.
      const selectedCode = editor.document.getText(editor.selection);

      const imperialAPI = new Imperial(config.apiToken);
      const documentSettings = {
        longerUrls: config.longerUrls || false,
        instantDelete: config.instantDelete || false,
        imageEmbed: config.imageEmbed || false,
        expiration: config.expiration || 5,
      };

      imperialAPI.createDocument(
        selectedCode,
        documentSettings,
        async (err, document) => {
          // If an error occurs

          if (err)
            return vscode.window.showInformationMessage(
              "This upload failed, you may be getting rate limited!"
            );

          // If it succeeds

          const selection = await vscode.window.showInformationMessage(
            /* Text */
            `Uploaded selected text to Imperial!\n${document.formattedLink}`,
            /* Buttons */
            "Copy Link",
            "Open Document"
          );

          const btnSelection = selection.toLowerCase();
          if (btnSelection == "copy link") {
            return await vscode.env.clipboard.writeText(document.formattedLink);
          } else if (btnSelection == "open document") {
            return await vscode.commands.executeCommand(
              "vscode.open",
              vscode.Uri.parse(document.formattedLink)
            );
          }
        }
      );
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
