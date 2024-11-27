import { app } from '@/scripts/app'

const TypeSlot: any = {
  Input: 1,
  Output: 2
}

const TypeSlotEvent: any = {
  Connect: true,
  Disconnect: false
}

const _ID: string = 'DynamicNode'

app.registerExtension({
  name: 'llm.' + _ID,
  async beforeRegisterNodeDef(nodeType: any, nodeData: any, app: any) {
    // skip the node if it is not the one we want
    if (!nodeData.name.startsWith('Dynamic ')) {
      return
    }

    const [, addType, addPrefix] = nodeData.name.split(' ')

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
