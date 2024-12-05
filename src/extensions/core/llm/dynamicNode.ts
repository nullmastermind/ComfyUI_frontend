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
    const { label: addPrefix, type: addType } = dynamicInputs[0]

    const onNodeCreated = nodeType.prototype.onNodeCreated
    nodeType.prototype.onNodeCreated = async function () {
      const me = onNodeCreated?.apply(this)
      // start with a new dynamic input
      this.addInput(addPrefix, addType)
      return me
    }

    const onConnectionsChange = nodeType.prototype.onConnectionsChange
    nodeType.prototype.onConnectionsChange = function (
      slotType: any,
      slot_idx: any,
      event: any,
      link_info: any,
      node_slot: any
    ) {
      const me = onConnectionsChange?.apply(this, arguments)

      if (
        !(node_slot.name.startsWith(addPrefix) && node_slot.type === addType)
      ) {
        return
      }

      if (slotType === TypeSlot.Input) {
        if (link_info && event === TypeSlotEvent.Connect) {
          // get the parent (left side node) from the link
          const fromNode = this.graph._nodes.find(
            (otherNode: any) => otherNode.id == link_info.origin_id
          )

          if (fromNode) {
            // make sure there is a parent for the link
            const parent_link = fromNode.outputs[link_info.origin_slot]
            if (parent_link) {
              node_slot.type = parent_link.type
              node_slot.name = `${addPrefix}_`
            }
          }
        } else if (event === TypeSlotEvent.Disconnect) {
          this.removeInput(slot_idx)
        }

        // Track each slot name so we can index the uniques
        let idx = 0
        let slot_tracker: any = {}
        for (const slot of this.inputs) {
          if (
            !(slot.name.startsWith(`${addPrefix}`) && slot.type === addType)
          ) {
            idx += 1
            continue
          }

          if (slot.link === null) {
            this.removeInput(idx)
            continue
          }
          idx += 1
          const name = slot.name.split('_')[0]

          // Correctly increment the count in slot_tracker
          let count = (slot_tracker[name] || 0) + 1
          slot_tracker[name] = count

          // Update the slot name with the count if greater than 1
          slot.name = `${name}_${count}`
        }

        // check that the last slot is a dynamic entry....
        let last = this.inputs[this.inputs.length - 1]
        if (
          last === undefined ||
          last.name != addPrefix ||
          last.type != addType
        ) {
          this.addInput(addPrefix, addType)
        }

        // force the node to resize itself for the new/deleted connections
        this?.graph?.setDirtyCanvas(true)
        return me
      }
    }
    return nodeType
  }
})
