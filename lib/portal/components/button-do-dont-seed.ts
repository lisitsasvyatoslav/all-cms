export const BUTTON_DO_DONT_BLOCK_ID = "button-do-dont-guidelines";

/** Initial Payload content for Button documentation. Images are intentionally omitted. */
export const BUTTON_DO_DONT_SEED = {
  blockType: "doDont" as const,
  showLLM: true,
  heading: "Button guidelines",
  dos: [
    { text: "Use one primary call to action to help people proceed." },
    {
      text: "Use validation or other clear on-screen directions to help people proceed.",
    },
    {
      text: "Right-align buttons for focussed tasks, modal dialogs, and other areas with less content.",
    },
    {
      text: "Left align buttons on full-page forms, long lists of cards, or other screens with a lot of full-page content.",
    },
    { text: "Use sentence-case capitalization." },
    {
      text: "Use concise, easy to scan button labels to describe the action.",
    },
    { text: "Use active verbs or phrases that clearly indicate action." },
    {
      text: "Use consistent language for the button and other text describing the same action.",
    },
  ],
  donts: [
    {
      text: "Don’t use many calls to action in one page or container.",
    },
    {
      text: "Don’t disable form submission buttons, as this doesn’t give people clear a direction for how to proceed.",
    },
    { text: "Don't use title case capitalization or all caps." },
    { text: "Don't use long, redundant button labels." },
    {
      text: "Don't use vague and generic labels that make the user read the dialog before taking action.",
    },
    {
      text: "Don't use different words to refer to the same action.",
    },
  ],
};
