import { app } from '@/scripts/app'
import { NodeData } from '@/extensions/core/llm/commonTypes'

const TypeSlot: any = {
  Input: 1,
  Output: 2
}

const TypeSlotEvent: any = {
  Connect: true,
  Disconnect: false
}

app.registerExtension({
  name: 'llm.DynamicInputNode',
  async beforeRegisterNodeDef(nodeType: any, nodeData: NodeData, app: any) {
    // Find dynamic inputs from nodeData.input
    const dynamicInputs = []
    if (nodeData.input?.required) {
      for (const entry of Object.entries(nodeData.input.required)) {
        const [inputName, value] = entry
        const [inputType, config] = value as [unknown, { dynamic?: boolean }]
        if (config?.dynamic) {
          dynamicInputs.push({ label: inputName, type: inputType })
        }
      }
    }

    if (nodeData.input?.optional) {
      for (const entry of Object.entries(nodeData.input.optional)) {
        const [inputName, value] = entry
        const [inputType, config] = value as [unknown, { dynamic?: boolean }]
        if (config?.dynamic) {
          dynamicInputs.push({ label: inputName, type: inputType })
        }
      }
    }

    if (dynamicInputs.length === 0) {
      return
    }

    // We'll handle the first dynamic input for now
    const { label: inputLabel, type: inputType } = dynamicInputs[0]

    const onNodeCreated = nodeType.prototype.onNodeCreated
    nodeType.prototype.onNodeCreated = async function () {
      const result = onNodeCreated?.apply(this)
      const widgetIndex = this.widgets.findIndex(
        (widget: any) => widget.name === inputLabel
      )
      if (widgetIndex !== -1) {
        this.removeInput(widgetIndex)
      }
      // start with a new dynamic input
      this.addInput(inputLabel, inputType)
      return result
    }

    const onConnectionsChange = nodeType.prototype.onConnectionsChange
    nodeType.prototype.onConnectionsChange = function (
      connectionType: any,
      connectionIndex: any,
      connectionEvent: any,
      connectionInfo: any,
      targetSlot: any
    ) {
      // Call parent handler if it exists
      const result = onConnectionsChange?.apply(this, arguments)

      // Only handle changes to our dynamic input
      if (
        !(
          targetSlot.name.startsWith(inputLabel) &&
          targetSlot.type === inputType
        )
      ) {
        return
      }

      if (connectionType === TypeSlot.Input) {
        // Handle new connections
        if (connectionInfo && connectionEvent === TypeSlotEvent.Connect) {
          // get the source node (left side) from the connection
          const sourceNode = this.graph._nodes.find(
            (node: any) => node.id == connectionInfo.origin_id
          )

          if (sourceNode) {
            // make sure there is a valid source output for the connection
            const sourceOutput = sourceNode.outputs[connectionInfo.origin_slot]
            if (sourceOutput) {
              targetSlot.type = sourceOutput.type
              targetSlot.name = `${inputLabel}_`
            }
          }
        }
        // Handle disconnections
        else if (connectionEvent === TypeSlotEvent.Disconnect) {
          this.removeInput(connectionIndex)
        }

        // Update slot names to ensure uniqueness
        let currentIndex = 0
        let slotNameCounts: any = {}

        for (const slot of this.inputs) {
          // Skip slots that aren't our dynamic input type
          if (
            !(slot.name.startsWith(`${inputLabel}`) && slot.type === inputType)
          ) {
            currentIndex += 1
            continue
          }

          // Remove unconnected slots
          if (slot.link === null) {
            this.removeInput(currentIndex)
            continue
          }
          currentIndex += 1

          // Update slot names with incrementing numbers
          const baseName = slot.name.split('_')[0]
          let count = (slotNameCounts[baseName] || 0) + 1
          slotNameCounts[baseName] = count
          slot.name = `${baseName}_${count}`
        }

        // Ensure there's always an empty slot for new connections
        let lastSlot = this.inputs[this.inputs.length - 1]
        if (
          lastSlot === undefined ||
          lastSlot.name != inputLabel ||
          lastSlot.type != inputType
        ) {
          this.addInput(inputLabel, inputType)
        }

        // Refresh canvas to show changes
        this?.graph?.setDirtyCanvas(true)

        return result
      }
    }

    return nodeType
  }
})
