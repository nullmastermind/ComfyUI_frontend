import { app } from '@/scripts/app'

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
  async beforeRegisterNodeDef(nodeType: any, nodeData: any, app: any) {
    // Parse the nodeData.name for dynamic, type, and label
    const nameParts: string[] = nodeData.name.split(' ')
    const isDynamic = nameParts.includes('--dynamic')
    const typePart: string | undefined = nameParts.find((part: string) =>
      part.startsWith('--type=')
    )
    const labelPart: string | undefined =
      nameParts.find((part: string) => part.startsWith('--label=')) ||
      typePart?.toUpperCase()

    if (!isDynamic || !typePart || !labelPart) {
      return
    }

    const addType = typePart.split('=')[1]
    const addPrefix = labelPart.split('=')[1]

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