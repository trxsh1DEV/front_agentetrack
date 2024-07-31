import { mergeAttributes, Node } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";

// ORIGINAL CODE = https://github.com/ueberdosis/tiptap/blob/main/packages/extension-mention/src/mention.ts
export const createMentionExtension = (name: string) => {
  const MentionPluginKey = new PluginKey(name);

  return Node.create({
    name,

    addOptions() {
      return {
        HTMLAttributes: {},
        renderText({ options, node }: any) {
          return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
        },
        deleteTriggerWithBackspace: false,
        renderHTML({ options, node }: any) {
          return [
            "span",
            mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
            `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
          ];
        },
        suggestion: {
          char: "@",
          pluginKey: MentionPluginKey,
          command: ({ editor, range, props }: any) => {
            const nodeAfter = editor.view.state.selection.$to.nodeAfter;
            const overrideSpace = nodeAfter?.text?.startsWith(" ");

            if (overrideSpace) {
              range.to += 1;
            }

            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                {
                  type: this.name,
                  attrs: props,
                },
                {
                  type: "text",
                  text: " ",
                },
              ])
              .run();

            window.getSelection()?.collapseToEnd();
          },
          allow: ({ state, range }: any) => {
            const $from = state.doc.resolve(range.from);
            const type = state.schema.nodes[this.name];
            const allow = !!$from.parent.type.contentMatch.matchType(type);

            return allow;
          },
        },
      };
    },

    group: "inline",

    inline: true,

    selectable: false,

    atom: true,

    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-id"),
          renderHTML: (attributes) => {
            if (!attributes.id) {
              return {};
            }

            return {
              "data-id": attributes.id,
            };
          },
        },
        label: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-label"),
          renderHTML: (attributes) => {
            if (!attributes.label) {
              return {};
            }

            return {
              "data-label": attributes.label,
            };
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: `span[data-type="${this.name}"]`,
        },
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      const mergedOptions = { ...this.options };
      mergedOptions.HTMLAttributes = mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      );
      const html = this.options.renderHTML({
        options: mergedOptions,
        node,
      });

      return typeof html === "string"
        ? [
            "span",
            mergeAttributes(
              { "data-type": this.name },
              this.options.HTMLAttributes,
              HTMLAttributes
            ),
            html,
          ]
        : html;
    },

    renderText({ node }) {
      return this.options.renderText({
        options: this.options,
        node,
      });
    },

    addKeyboardShortcuts() {
      return {
        Backspace: () =>
          this.editor.commands.command(({ tr, state }) => {
            let isMention = false;
            const { selection } = state;
            const { empty, anchor } = selection;

            if (!empty) {
              return false;
            }

            state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
              if (node.type.name === this.name) {
                isMention = true;
                tr.insertText(
                  this.options.deleteTriggerWithBackspace
                    ? ""
                    : this.options.suggestion.char || "",
                  pos,
                  pos + node.nodeSize
                );

                return false;
              }
            });

            return isMention;
          }),
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
};
