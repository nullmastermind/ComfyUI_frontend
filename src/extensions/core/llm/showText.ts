import { ComfyWidgets } from '@/scripts/widgets'
import { app } from '@/scripts/app'
import { NodeData } from '@/extensions/core/llm/commonTypes'

app.registerExtension({
  name: 'llm.ShowText',
  async beforeRegisterNodeDef(nodeType: any, nodeData: NodeData, app: any) {
    if (nodeData.output?.includes('OUTPUT_TEXT')) {
      const onExecuted: any = nodeType.prototype.onExecuted

      nodeType.prototype.onExecuted = function (message: any) {
        onExecuted?.apply(this, arguments)

        if (this.widgets) {
          for (let i = 1; i < this.widgets.length; i++) {
            this.widgets[i].onRemove?.()
          }
          this.widgets.length = 1
        }

        // Check if the "text" widget already exists.
        let textWidget: any =
          this.widgets &&
          this.widgets.find((w: any) => w.name === 'displaytext')
        if (!textWidget) {
          textWidget = ComfyWidgets['STRING'](
            this,
            'displaytext',
            ['STRING', { multiline: true }],
            app
          ).widget
          textWidget.inputEl.readOnly = true
          textWidget.inputEl.style.border = 'none'
          textWidget.inputEl.style.backgroundColor = 'transparent'
        }
        textWidget.value = message['text'].join('')
      }
    }
  }
})
