import { app } from '@/scripts/app'
import { ComfyExtension } from '@/types/comfy'
import { LGraphCanvas, LiteGraph } from '@comfyorg/litegraph'

app.registerExtension({
  name: 'llm.WidgetClick',
  nodeCreated(node: any, app: any) {
    if (!node.widgets) {
      return
    }

    for (const widget of node.widgets) {
      if (['text', 'string', 'number'].includes(widget.type || '')) {
        widget.onPointerDown = function (
          this: any,
          pointer: any,
          _node: any,
          instance: any
        ) {
          pointer.onClick = () => {
            // Show prompt dialog to get new widget value
            prompt.call(
              instance,
              `${node.title}`,
              widget.name,
              widget.value,
              (updatedValue: any) => {
                // Store current value before updating
                const currentValue = widget.value
                widget.value =
                  widget.type === 'number' ? +updatedValue : updatedValue

                if (widget.type === 'number' && isNaN(widget.value)) {
                  widget.value = +currentValue
                }

                // Update node property if widget is bound to one
                const boundProperty = widget.options?.property
                if (
                  boundProperty &&
                  node.properties[boundProperty] !== undefined
                ) {
                  node.setProperty(boundProperty, updatedValue)
                }

                // Call widget's callback if defined
                widget.callback?.(
                  widget.value,
                  app.canvas,
                  node,
                  pointer.graph_mouse,
                  pointer.eLastDown
                )

                // Notify node of widget value change
                node.graph?.onWidgetChanged?.(
                  widget.name || '',
                  updatedValue,
                  currentValue,
                  widget
                )

                // Increment graph version to mark changes
                node.graph!._version++
              },
              instance.mouse,
              widget.options?.multiline ?? false
            )
          }

          return true
        }
      }
    }
  }
} as ComfyExtension)

function prompt(
  this: any,
  title: string,
  placeholder: string,
  value: any,
  callback: (arg0: any) => void,
  lastClickPosition: any,
  multiline?: boolean
): HTMLDivElement {
  const context = this
  title = title || ''
  placeholder = placeholder || ''

  // Create and configure dialog element
  const dialogElement: any = document.createElement('div')
  dialogElement.is_modified = false
  dialogElement.className = multiline
    ? 'graphdialog graphdialog-multiline rounded'
    : 'graphdialog rounded'
  dialogElement.innerHTML = multiline
    ? `<div class='name'>${title}</div><textarea  placeholder='${placeholder}' autofocus class='value' rows='6' style='max-height: calc(18 * 1.2em);'></textarea><button>Save</button>`
    : `<span class='name' style='display: none'></span><input autofocus type='text' class='value' placeholder='${placeholder}'/><button>Save</button>`
  dialogElement.close = function () {
    context.prompt_box = null
    if (dialogElement.parentNode) {
      dialogElement.parentNode.removeChild(dialogElement)
    }
  }

  // Add dialog to canvas
  const graphCanvas = LGraphCanvas.active_canvas
  const canvasElement = graphCanvas.canvas
  canvasElement.parentNode?.appendChild(dialogElement)

  if (this.ds.scale > 1) {
    dialogElement.style.transform = 'scale(' + this.ds.scale + ')'
  }

  // Handle mouse enter/leave behavior
  let closeTimer: any = null
  let preventTimeout = 0
  LiteGraph.pointerListenerAdd(dialogElement, 'leave', function () {
    if (preventTimeout) return
    if (LiteGraph.dialog_close_on_mouse_leave)
      if (!dialogElement.is_modified && LiteGraph.dialog_close_on_mouse_leave)
        closeTimer = setTimeout(
          dialogElement.close,
          LiteGraph.dialog_close_on_mouse_leave_delay
        )
  })
  LiteGraph.pointerListenerAdd(dialogElement, 'enter', function () {
    if (LiteGraph.dialog_close_on_mouse_leave && closeTimer)
      clearTimeout(closeTimer)
  })

  // Handle select elements within dialog
  const selectElements = dialogElement.querySelectorAll('select')
  if (selectElements) {
    for (const selectElement of selectElements) {
      selectElement.addEventListener('click', function () {
        preventTimeout++
      })
      selectElement.addEventListener('blur', function () {
        preventTimeout = 0
      })
      selectElement.addEventListener('change', function () {
        preventTimeout = -1
      })
    }
  }

  // Close existing prompt box if any
  this.prompt_box?.close()
  this.prompt_box = dialogElement

  // Set up title and value elements
  const titleElement: HTMLSpanElement = dialogElement.querySelector('.name')
  titleElement.innerText = title
  const valueElement: HTMLTextAreaElement | HTMLInputElement =
    dialogElement.querySelector('.value')
  valueElement.value = value
  valueElement.select()

  // Handle input events
  valueElement.addEventListener('keydown', function (
    this: any,
    e: KeyboardEvent
  ) {
    dialogElement.is_modified = true
    if (e.code === 'Escape') {
      // ESC
      dialogElement.close()
    } else if (
      e.code === 'Enter' &&
      (e.target as Element).localName != 'textarea'
    ) {
      if (callback) {
        callback(this.value)
      }
      dialogElement.close()
    } else {
      return
    }
    e.preventDefault()
    e.stopPropagation()
  } as any)

  // Handle button click
  const submitButton = dialogElement.querySelector('button')
  submitButton.addEventListener('click', function () {
    callback?.(valueElement.value)
    context.setDirty(true)
    dialogElement.close()
  })

  // Position dialog on screen
  const canvasRect = canvasElement.getBoundingClientRect()
  let xOffset = -20
  let yOffset = -20
  if (canvasRect) {
    xOffset -= canvasRect.left
    yOffset -= canvasRect.top
  }

  if (lastClickPosition?.length === 2) {
    dialogElement.style.left = lastClickPosition[0] + xOffset + 'px'
    dialogElement.style.top = lastClickPosition[1] + yOffset + 'px'
  } else {
    dialogElement.style.left = canvasElement.width * 0.5 + xOffset + 'px'
    dialogElement.style.top = canvasElement.height * 0.5 + yOffset + 'px'
  }

  // Focus input and handle outside clicks
  setTimeout(function () {
    valueElement.focus()
    const initialClickTime = Date.now()
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target === canvasElement && Date.now() - initialClickTime > 256) {
        dialogElement.close()
        canvasElement.parentNode?.removeEventListener(
          'click',
          handleOutsideClick as EventListener
        )
        canvasElement.parentNode?.removeEventListener(
          'touchend',
          handleOutsideClick as EventListener
        )
      }
    }
    canvasElement.parentNode?.addEventListener(
      'click',
      handleOutsideClick as EventListener
    )
    canvasElement.parentNode?.addEventListener(
      'touchend',
      handleOutsideClick as EventListener
    )
  }, 10)

  return dialogElement
}
