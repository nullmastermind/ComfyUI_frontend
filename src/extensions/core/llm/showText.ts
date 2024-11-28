import { ComfyWidgets } from '@/scripts/widgets'
import { app } from '@/scripts/app'

app.registerExtension({
  name: 'llm.ShowText',
  async beforeRegisterNodeDef(nodeType: any, nodeData: any, app: any) {
    if (nodeData.name.endsWith('OutputText')) {
      function populateTextWidgets(this: any, textContent: string | string[]) {
        if (this.widgets) {
          for (let i = this.widgets.length - 1; i >= 0; i--) {
            this.widgets[i].onRemove?.()
          }
          this.widgets.length = 0
        }

        // Convert input to array and remove empty first element if exists
        const textLines = [...textContent]
        if (!textLines[0]) {
          textLines.shift()
        }

        // Create text widgets for each line of content
        for (const textLine of textLines) {
          const textWidget = ComfyWidgets['STRING'](
            this,
            'text',
            ['STRING', { multiline: true }],
            app
          ).widget as any
          textWidget.inputEl.readOnly = true
          textWidget.value = textLine
        }

        // Update node size on next frame to accommodate new widgets
        requestAnimationFrame(() => {
          const computedSize = this.computeSize()
          const newSize = [
            Math.max(computedSize[0], this.size[0]),
            Math.max(computedSize[1], this.size[1])
          ]
          this.onResize?.(newSize)
          app.graph.setDirtyCanvas(true, false)
        })
      }

      // When the node is executed we will be sent the input text, display this in the widget
      const onExecuted = nodeType.prototype.onExecuted
      nodeType.prototype.onExecuted = function (message: any) {
        onExecuted?.apply(this, arguments)
        populateTextWidgets.call(this, message.text)
      }

      const onConfigure = nodeType.prototype.onConfigure
      nodeType.prototype.onConfigure = function () {
        onConfigure?.apply(this, arguments)
        if (this.widgets_values?.length) {
          populateTextWidgets.call(this, this.widgets_values)
        }
      }
    }
  }
})