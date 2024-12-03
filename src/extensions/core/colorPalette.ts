// @ts-strict-ignore
import { useToastStore } from '@/stores/toastStore'
import { app } from '@/scripts/app'
import { $el } from '@/scripts/ui'
import type { ColorPalettes, Palette } from '@/types/colorPalette'
import { LGraphCanvas, LiteGraph } from '@comfyorg/litegraph'

// Manage color palettes

const colorPalettes: ColorPalettes = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      node_slot: {
        CLIP: '#FFA726', // orange
        CLIP_VISION: '#5C6BC0', // indigo
        CLIP_VISION_OUTPUT: '#8D6E63', // brown
        CONDITIONING: '#EF5350', // red
        CONTROL_NET: '#66BB6A', // green
        IMAGE: '#42A5F5', // blue
        LATENT: '#AB47BC', // purple
        MASK: '#9CCC65', // light green
        MODEL: '#7E57C2', // deep purple
        STYLE_MODEL: '#D4E157', // lime
        VAE: '#FF7043', // deep orange
        ROUTE_DATA: '#DCC274'
      },
      litegraph_base: {
        BACKGROUND_IMAGE:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABXSURBVEhLY/zw6ft/BjoAJihNczBqEdlg1CKywahFZAOSLfrx4xsYkwpIsghkwffv38GYVMvoFnQkl94wn3BwcIFpYsFoNUE2GLWIbDBqEdlguFnEwAAAG2EgHDt1gjMAAAAASUVORK5CYII=',
        CLEAR_BACKGROUND_COLOR: '#F0F2F7',
        NODE_TITLE_COLOR: '#222',
        NODE_SELECTED_TITLE_COLOR: '#000',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#444',
        NODE_SUBTEXT_SIZE: 12,
        NODE_DEFAULT_COLOR: '#fff',
        NODE_DEFAULT_BGCOLOR: '#F5F5F5',
        NODE_DEFAULT_BOXCOLOR: '#CCC',
        NODE_DEFAULT_SHAPE: 'box',
        NODE_BOX_OUTLINE_COLOR: '#296CFC',
        NODE_BYPASS_BGCOLOR: '#FF00FF',
        NODE_ERROR_COLOUR: '#E00',
        DEFAULT_SHADOW_COLOR: 'rgba(0,0,0,0.1)',
        DEFAULT_GROUP_FONT: 24,

        WIDGET_BGCOLOR: '#F2F4F7',
        WIDGET_OUTLINE_COLOR: '#dfdfdf',
        WIDGET_TEXT_COLOR: '#222',
        WIDGET_SECONDARY_TEXT_COLOR: '#555',

        LINK_COLOR: '#D0D5DD',
        EVENT_LINK_COLOR: '#FF9800',
        CONNECTING_LINK_COLOR: '#2196F3',

        BADGE_FG_COLOR: '#000',
        BADGE_BG_COLOR: '#FFF'
      },
      comfy_base: {
        'fg-color': '#222',
        'bg-color': '#DDD',
        'comfy-menu-bg': '#fff',
        'comfy-input-bg': '#F2F4F7',
        'input-text': '#222',
        'descrip-text': '#444',
        'drag-text': '#555',
        'error-text': '#F44336',
        'border-color': '#dfdfdf',
        'tr-even-bg-color': '#f9f9f9',
        'tr-odd-bg-color': '#fff',
        'content-bg': '#e0e0e0',
        'content-fg': '#222',
        'content-hover-bg': '#adadad',
        'content-hover-fg': '#222'
      }
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      node_slot: {
        BOOLEAN: '',
        CLIP: '#eacb8b',
        CLIP_VISION: '#A8DADC',
        CLIP_VISION_OUTPUT: '#ad7452',
        CONDITIONING: '#cf876f',
        CONTROL_NET: '#00d78d',
        CONTROL_NET_WEIGHTS: '',
        FLOAT: '',
        GLIGEN: '',
        IMAGE: '#80a1c0',
        IMAGEUPLOAD: '',
        INT: '',
        LATENT: '#b38ead',
        LATENT_KEYFRAME: '',
        MASK: '#a3bd8d',
        MODEL: '#8978a7',
        SAMPLER: '',
        SIGMAS: '',
        STRING: '',
        STYLE_MODEL: '#C2FFAE',
        T2I_ADAPTER_WEIGHTS: '',
        TAESD: '#DCC274',
        TIMESTEP_KEYFRAME: '',
        UPSCALE_MODEL: '',
        VAE: '#be616b',
        ROUTE_DATA: '#DCC274',
        NODE_ERROR_COLOUR: '#E00'
      },
      litegraph_base: {
        BACKGROUND_IMAGE:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABdSURBVEhL7dBBCsAgDETRWGoP04Xr3v9YtWCJeoGZokiZD8HsHiac6So2oa2/wxNEJ4hOEB0M3U+ugwZBDpTcBsXWPN2xRwuxje9I8I8cQBFvzdN9SRCdILq/QWYvjtMTwzsv5W8AAAAASUVORK5CYII=',
        CLEAR_BACKGROUND_COLOR: '#2b2f38',
        NODE_TITLE_COLOR: '#b2b7bd',
        NODE_SELECTED_TITLE_COLOR: '#FFF',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#AAA',
        NODE_SUBTEXT_SIZE: 12,
        NODE_DEFAULT_COLOR: '#1a1c22',
        NODE_DEFAULT_BGCOLOR: '#242730',
        NODE_DEFAULT_BOXCOLOR: '#6e7581',
        NODE_DEFAULT_SHAPE: 'box',
        NODE_BOX_OUTLINE_COLOR: '#296CFC',
        NODE_BYPASS_BGCOLOR: '#FF00FF',
        NODE_ERROR_COLOUR: '#E00',
        DEFAULT_SHADOW_COLOR: 'rgba(0,0,0,0.5)',
        DEFAULT_GROUP_FONT: 22,
        WIDGET_BGCOLOR: '#2b2f38',
        WIDGET_OUTLINE_COLOR: '#333',
        WIDGET_TEXT_COLOR: '#DDD',
        WIDGET_SECONDARY_TEXT_COLOR: '#b2b7bd',
        LINK_COLOR: '#9A9',
        EVENT_LINK_COLOR: '#A86',
        CONNECTING_LINK_COLOR: '#AFA',
        BADGE_FG_COLOR: '#FFF',
        BADGE_BG_COLOR: '#0F1F0F'
      },
      comfy_base: {
        'fg-color': '#fff',
        'bg-color': '#2b2f38',
        'comfy-menu-bg': '#242730',
        'comfy-input-bg': '#2b2f38',
        'input-text': '#ddd',
        'descrip-text': '#b2b7bd',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#333',
        'tr-even-bg-color': '#2b2f38',
        'tr-odd-bg-color': '#242730',
        'content-bg': '#6e7581',
        'content-fg': '#fff',
        'content-hover-bg': '#2b2f38',
        'content-hover-fg': '#fff'
      }
    }
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    colors: {
      node_slot: {
        BOOLEAN: '',
        CLIP: '#eacb8b',
        CLIP_VISION: '#A8DADC',
        CLIP_VISION_OUTPUT: '#ad7452',
        CONDITIONING: '#cf876f',
        CONTROL_NET: '#00d78d',
        CONTROL_NET_WEIGHTS: '',
        FLOAT: '',
        GLIGEN: '',
        IMAGE: '#80a1c0',
        IMAGEUPLOAD: '',
        INT: '',
        LATENT: '#b38ead',
        LATENT_KEYFRAME: '',
        MASK: '#a3bd8d',
        MODEL: '#8978a7',
        SAMPLER: '',
        SIGMAS: '',
        STRING: '',
        STYLE_MODEL: '#C2FFAE',
        T2I_ADAPTER_WEIGHTS: '',
        TAESD: '#DCC274',
        TIMESTEP_KEYFRAME: '',
        UPSCALE_MODEL: '',
        VAE: '#be616b'
      },
      litegraph_base: {
        BACKGROUND_IMAGE:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMS0xM1QwMDoxODowMiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTEtMTVUMDE6MjA6NDUrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTEtMTVUMDE6MjA6NDUrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUwNDFhMmZjLTEzNzQtMTk0ZC1hZWY4LTYxMzM1MTVmNjUwMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMzFiMTBiMC1iNGZiLTAyNGUtYjEyZS0zMDUzMDNjZDA3YzgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMzFiMTBiMC1iNGZiLTAyNGUtYjEyZS0zMDUzMDNjZDA3YzgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMWIxMGIwLWI0ZmItMDI0ZS1iMTJlLTMwNTMwM2NkMDdjOCIgc3RFdnQ6d2hlbj0iMjAyMy0xMS0xM1QwMDoxODowMiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MDQxYTJmYy0xMzc0LTE5NGQtYWVmOC02MTMzNTE1ZjY1MDAiIHN0RXZ0OndoZW49IjIwMjMtMTEtMTVUMDE6MjA6NDUrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73jWg/AAAAyUlEQVR42u3WKwoAIBRFQRdiMb1idv9Lsxn9gEFw4Dbb8JCTojbbXEJwjJVL2HKwYMGCBQuWLbDmjr+9zrBGjHl1WVcvy2DBggULFizTWQpewSt4HzwsgwULFiwFr7MUvMtS8D54WLBgGSxYCl7BK3iXZbBgwYIFC5bpLAWv4BW8Dx6WwYIFC5aC11kK3mUpeB88LFiwDBYsBa/gFbzLMliwYMGCBct0loJX8AreBw/LYMGCBUvB6ywF77IUvA8eFixYBgsWrNfWAZPltufdad+1AAAAAElFTkSuQmCC',
        CLEAR_BACKGROUND_COLOR: '#212732',
        NODE_TITLE_COLOR: '#999',
        NODE_SELECTED_TITLE_COLOR: '#e5eaf0',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#bcc2c8',
        NODE_SUBTEXT_SIZE: 12,
        NODE_DEFAULT_COLOR: '#2e3440',
        NODE_DEFAULT_BGCOLOR: '#161b22',
        NODE_DEFAULT_BOXCOLOR: '#545d70',
        NODE_DEFAULT_SHAPE: 'box',
        NODE_BOX_OUTLINE_COLOR: '#e5eaf0',
        NODE_BYPASS_BGCOLOR: '#FF00FF',
        DEFAULT_SHADOW_COLOR: 'rgba(0,0,0,0.5)',
        DEFAULT_GROUP_FONT: 24,
        WIDGET_BGCOLOR: '#2e3440',
        WIDGET_OUTLINE_COLOR: '#545d70',
        WIDGET_TEXT_COLOR: '#bcc2c8',
        WIDGET_SECONDARY_TEXT_COLOR: '#999',
        LINK_COLOR: '#9A9',
        EVENT_LINK_COLOR: '#A86',
        CONNECTING_LINK_COLOR: '#AFA'
      },
      comfy_base: {
        'fg-color': '#e5eaf0',
        'bg-color': '#2e3440',
        'comfy-menu-bg': '#161b22',
        'comfy-input-bg': '#2e3440',
        'input-text': '#bcc2c8',
        'descrip-text': '#999',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#545d70',
        'tr-even-bg-color': '#2e3440',
        'tr-odd-bg-color': '#161b22',
        'content-bg': '#545d70',
        'content-fg': '#e5eaf0',
        'content-hover-bg': '#2e3440',
        'content-hover-fg': '#e5eaf0'
      }
    }
  },
  github: {
    id: 'github',
    name: 'Github',
    colors: {
      node_slot: {
        BOOLEAN: '',
        CLIP: '#eacb8b',
        CLIP_VISION: '#A8DADC',
        CLIP_VISION_OUTPUT: '#ad7452',
        CONDITIONING: '#cf876f',
        CONTROL_NET: '#00d78d',
        CONTROL_NET_WEIGHTS: '',
        FLOAT: '',
        GLIGEN: '',
        IMAGE: '#80a1c0',
        IMAGEUPLOAD: '',
        INT: '',
        LATENT: '#b38ead',
        LATENT_KEYFRAME: '',
        MASK: '#a3bd8d',
        MODEL: '#8978a7',
        SAMPLER: '',
        SIGMAS: '',
        STRING: '',
        STYLE_MODEL: '#C2FFAE',
        T2I_ADAPTER_WEIGHTS: '',
        TAESD: '#DCC274',
        TIMESTEP_KEYFRAME: '',
        UPSCALE_MODEL: '',
        VAE: '#be616b'
      },
      litegraph_base: {
        BACKGROUND_IMAGE:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGlmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMS0xM1QwMDoxODowMiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTEtMTVUMDI6MDQ6NTkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTEtMTVUMDI6MDQ6NTkrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmIyYzRhNjA5LWJmYTctYTg0MC1iOGFlLTk3MzE2ZjM1ZGIyNyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk0ZmNlZGU4LTE1MTctZmQ0MC04ZGU3LWYzOTgxM2E3ODk5ZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjIzMWIxMGIwLWI0ZmItMDI0ZS1iMTJlLTMwNTMwM2NkMDdjOCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjMxYjEwYjAtYjRmYi0wMjRlLWIxMmUtMzA1MzAzY2QwN2M4IiBzdEV2dDp3aGVuPSIyMDIzLTExLTEzVDAwOjE4OjAyKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ4OWY1NzlmLTJkNjUtZWQ0Zi04OTg0LTA4NGE2MGE1ZTMzNSIgc3RFdnQ6d2hlbj0iMjAyMy0xMS0xNVQwMjowNDo1OSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMmM0YTYwOS1iZmE3LWE4NDAtYjhhZS05NzMxNmYzNWRiMjciIHN0RXZ0OndoZW49IjIwMjMtMTEtMTVUMDI6MDQ6NTkrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4OTe6GAAAAx0lEQVR42u3WMQoAIQxFwRzJys77X8vSLiRgITif7bYbgrwYc/mKXyBoY4VVBgsWLFiwYFmOlTv+9jfDOjHmr8u6eVkGCxYsWLBgmc5S8ApewXvgYRksWLBgKXidpeBdloL3wMOCBctgwVLwCl7BuyyDBQsWLFiwTGcpeAWv4D3wsAwWLFiwFLzOUvAuS8F74GHBgmWwYCl4Ba/gXZbBggULFixYprMUvIJX8B54WAYLFixYCl5nKXiXpeA98LBgwTJYsGC9tg1o8f4TTtqzNQAAAABJRU5ErkJggg==',
        CLEAR_BACKGROUND_COLOR: '#040506',
        NODE_TITLE_COLOR: '#999',
        NODE_SELECTED_TITLE_COLOR: '#e5eaf0',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#bcc2c8',
        NODE_SUBTEXT_SIZE: 12,
        NODE_DEFAULT_COLOR: '#161b22',
        NODE_DEFAULT_BGCOLOR: '#13171d',
        NODE_DEFAULT_BOXCOLOR: '#30363d',
        NODE_DEFAULT_SHAPE: 'box',
        NODE_BOX_OUTLINE_COLOR: '#e5eaf0',
        NODE_BYPASS_BGCOLOR: '#FF00FF',
        DEFAULT_SHADOW_COLOR: 'rgba(0,0,0,0.5)',
        DEFAULT_GROUP_FONT: 24,
        WIDGET_BGCOLOR: '#161b22',
        WIDGET_OUTLINE_COLOR: '#30363d',
        WIDGET_TEXT_COLOR: '#bcc2c8',
        WIDGET_SECONDARY_TEXT_COLOR: '#999',
        LINK_COLOR: '#9A9',
        EVENT_LINK_COLOR: '#A86',
        CONNECTING_LINK_COLOR: '#AFA'
      },
      comfy_base: {
        'fg-color': '#e5eaf0',
        'bg-color': '#161b22',
        'comfy-menu-bg': '#13171d',
        'comfy-input-bg': '#161b22',
        'input-text': '#bcc2c8',
        'descrip-text': '#999',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#30363d',
        'tr-even-bg-color': '#161b22',
        'tr-odd-bg-color': '#13171d',
        'content-bg': '#30363d',
        'content-fg': '#e5eaf0',
        'content-hover-bg': '#161b22',
        'content-hover-fg': '#e5eaf0'
      }
    }
  }
}

const id = 'Comfy.ColorPalette'
const idCustomColorPalettes = 'Comfy.CustomColorPalettes'
const defaultColorPaletteId = 'dark'
const els: { select: HTMLSelectElement | null } = {
  select: null
}

const getCustomColorPalettes = (): ColorPalettes => {
  return app.ui.settings.getSettingValue(idCustomColorPalettes, {})
}

const setCustomColorPalettes = (customColorPalettes: ColorPalettes) => {
  return app.ui.settings.setSettingValue(
    idCustomColorPalettes,
    customColorPalettes
  )
}

export const defaultColorPalette = colorPalettes[defaultColorPaletteId]
export const getColorPalette = (
  colorPaletteId?: string
): Palette | undefined => {
  if (!colorPaletteId) {
    colorPaletteId = app.ui.settings.getSettingValue(id, defaultColorPaletteId)
  }

  if (colorPaletteId.startsWith('custom_')) {
    colorPaletteId = colorPaletteId.substr(7)
    let customColorPalettes = getCustomColorPalettes()
    if (customColorPalettes[colorPaletteId]) {
      return customColorPalettes[colorPaletteId]
    }
  }

  return colorPalettes[colorPaletteId]
}

const setColorPalette = (colorPaletteId) => {
  app.ui.settings.setSettingValue(id, colorPaletteId)
}

// const ctxMenu = LiteGraph.ContextMenu;
app.registerExtension({
  name: id,
  init() {
    /**
     * Changes the background color of the canvas.
     *
     * @method updateBackground
     * @param {image} String
     * @param {clearBackgroundColor} String
     */
    // @ts-expect-error
    LGraphCanvas.prototype.updateBackground = function (
      image,
      clearBackgroundColor
    ) {
      this._bg_img = new Image()
      this._bg_img.name = image
      this._bg_img.src = image
      this._bg_img.onload = () => {
        this.draw(true, true)
      }
      this.background_image = image

      this.clear_background = true
      this.clear_background_color = clearBackgroundColor
      this._pattern = null
    }
  },
  addCustomNodeDefs(node_defs) {
    const sortObjectKeys = (unordered) => {
      return Object.keys(unordered)
        .sort()
        .reduce((obj, key) => {
          obj[key] = unordered[key]
          return obj
        }, {})
    }

    function getSlotTypes() {
      var types = []

      const defs = node_defs
      for (const nodeId in defs) {
        const nodeData = defs[nodeId]

        var inputs = nodeData['input']['required']
        if (nodeData['input']['optional'] !== undefined) {
          inputs = Object.assign(
            {},
            nodeData['input']['required'],
            nodeData['input']['optional']
          )
        }

        for (const inputName in inputs) {
          const inputData = inputs[inputName]
          const type = inputData[0]

          if (!Array.isArray(type)) {
            types.push(type)
          }
        }

        for (const o in nodeData['output']) {
          const output = nodeData['output'][o]
          types.push(output)
        }
      }

      return types
    }

    function completeColorPalette(colorPalette) {
      var types = getSlotTypes()

      for (const type of types) {
        if (!colorPalette.colors.node_slot[type]) {
          colorPalette.colors.node_slot[type] = ''
        }
      }

      colorPalette.colors.node_slot = sortObjectKeys(
        colorPalette.colors.node_slot
      )

      return colorPalette
    }

    const getColorPaletteTemplate = async () => {
      let colorPalette = {
        id: 'my_color_palette_unique_id',
        name: 'My Color Palette',
        colors: {
          node_slot: {},
          litegraph_base: {},
          comfy_base: {}
        }
      }

      // Copy over missing keys from default color palette
      const defaultColorPalette = colorPalettes[defaultColorPaletteId]
      for (const key in defaultColorPalette.colors.litegraph_base) {
        if (!colorPalette.colors.litegraph_base[key]) {
          colorPalette.colors.litegraph_base[key] = ''
        }
      }
      for (const key in defaultColorPalette.colors.comfy_base) {
        if (!colorPalette.colors.comfy_base[key]) {
          colorPalette.colors.comfy_base[key] = ''
        }
      }

      return completeColorPalette(colorPalette)
    }

    const addCustomColorPalette = async (colorPalette) => {
      if (typeof colorPalette !== 'object') {
        useToastStore().addAlert('Invalid color palette.')
        return
      }

      if (!colorPalette.id) {
        useToastStore().addAlert('Color palette missing id.')
        return
      }

      if (!colorPalette.name) {
        useToastStore().addAlert('Color palette missing name.')
        return
      }

      if (!colorPalette.colors) {
        useToastStore().addAlert('Color palette missing colors.')
        return
      }

      if (
        colorPalette.colors.node_slot &&
        typeof colorPalette.colors.node_slot !== 'object'
      ) {
        useToastStore().addAlert('Invalid color palette colors.node_slot.')
        return
      }

      const customColorPalettes = getCustomColorPalettes()
      customColorPalettes[colorPalette.id] = colorPalette
      setCustomColorPalettes(customColorPalettes)

      for (const option of els.select.childNodes) {
        if (
          (option as HTMLOptionElement).value ===
          'custom_' + colorPalette.id
        ) {
          els.select.removeChild(option)
        }
      }

      els.select.append(
        $el('option', {
          textContent: colorPalette.name + ' (custom)',
          value: 'custom_' + colorPalette.id,
          selected: true
        })
      )

      setColorPalette('custom_' + colorPalette.id)
      await loadColorPalette(colorPalette)
    }

    const deleteCustomColorPalette = async (colorPaletteId) => {
      const customColorPalettes = getCustomColorPalettes()
      delete customColorPalettes[colorPaletteId]
      setCustomColorPalettes(customColorPalettes)

      for (const opt of els.select.childNodes) {
        const option = opt as HTMLOptionElement
        if (option.value === defaultColorPaletteId) {
          option.selected = true
        }

        if (option.value === 'custom_' + colorPaletteId) {
          els.select.removeChild(option)
        }
      }

      setColorPalette(defaultColorPaletteId)
      await loadColorPalette(getColorPalette())
    }

    const loadColorPalette = async (colorPalette: Palette) => {
      colorPalette = await completeColorPalette(colorPalette)
      if (colorPalette.colors) {
        // Sets the colors of node slots and links
        if (colorPalette.colors.node_slot) {
          Object.assign(
            app.canvas.default_connection_color_byType,
            colorPalette.colors.node_slot
          )
          Object.assign(
            LGraphCanvas.link_type_colors,
            colorPalette.colors.node_slot
          )
        }
        // Sets the colors of the LiteGraph objects
        if (colorPalette.colors.litegraph_base) {
          // Everything updates correctly in the loop, except the Node Title and Link Color for some reason
          app.canvas.node_title_color =
            colorPalette.colors.litegraph_base.NODE_TITLE_COLOR
          app.canvas.default_link_color =
            colorPalette.colors.litegraph_base.LINK_COLOR

          for (const key in colorPalette.colors.litegraph_base) {
            if (
              colorPalette.colors.litegraph_base.hasOwnProperty(key) &&
              LiteGraph.hasOwnProperty(key)
            ) {
              LiteGraph[key] = colorPalette.colors.litegraph_base[key]
            }
          }
        }
        // Sets the color of ComfyUI elements
        if (colorPalette.colors.comfy_base) {
          const rootStyle = document.documentElement.style
          for (const key in colorPalette.colors.comfy_base) {
            rootStyle.setProperty(
              '--' + key,
              colorPalette.colors.comfy_base[key]
            )
          }
        }
        // Sets special case colors
        if (colorPalette.colors.litegraph_base.NODE_BYPASS_BGCOLOR) {
          app.bypassBgColor =
            colorPalette.colors.litegraph_base.NODE_BYPASS_BGCOLOR
        }
        app.canvas.draw(true, true)
      }
    }

    const fileInput = $el('input', {
      type: 'file',
      accept: '.json',
      style: { display: 'none' },
      parent: document.body,
      onchange: () => {
        const file = fileInput.files[0]
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const reader = new FileReader()
          reader.onload = async () => {
            await addCustomColorPalette(JSON.parse(reader.result as string))
          }
          reader.readAsText(file)
        }
      }
    }) as HTMLInputElement

    app.ui.settings.addSetting({
      id,
      category: ['Appearance', 'ColorPalette'],
      name: 'Color Palette',
      type: (name, setter, value) => {
        const options = [
          ...Object.values(colorPalettes).map((c) =>
            $el('option', {
              textContent: c.name,
              value: c.id,
              selected: c.id === value
            })
          ),
          ...Object.values(getCustomColorPalettes()).map((c) =>
            $el('option', {
              textContent: `${c.name} (custom)`,
              value: `custom_${c.id}`,
              selected: `custom_${c.id}` === value
            })
          )
        ]

        els.select = $el(
          'select',
          {
            style: {
              marginBottom: '0.15rem',
              width: '100%'
            },
            onchange: (e) => {
              setter(e.target.value)
            }
          },
          options
        ) as HTMLSelectElement

        return $el('tr', [
          $el('td', [
            els.select,
            $el(
              'div',
              {
                style: {
                  display: 'grid',
                  gap: '4px',
                  gridAutoFlow: 'column'
                }
              },
              [
                $el('input', {
                  type: 'button',
                  value: 'Export',
                  onclick: async () => {
                    const colorPaletteId = app.ui.settings.getSettingValue(
                      id,
                      defaultColorPaletteId
                    )
                    const colorPalette = await completeColorPalette(
                      getColorPalette(colorPaletteId)
                    )
                    const json = JSON.stringify(colorPalette, null, 2) // convert the data to a JSON string
                    const blob = new Blob([json], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = $el('a', {
                      href: url,
                      download: colorPaletteId + '.json',
                      style: { display: 'none' },
                      parent: document.body
                    })
                    a.click()
                    setTimeout(function () {
                      a.remove()
                      window.URL.revokeObjectURL(url)
                    }, 0)
                  }
                }),
                $el('input', {
                  type: 'button',
                  value: 'Import',
                  onclick: () => {
                    fileInput.click()
                  }
                }),
                $el('input', {
                  type: 'button',
                  value: 'Template',
                  onclick: async () => {
                    const colorPalette = await getColorPaletteTemplate()
                    const json = JSON.stringify(colorPalette, null, 2) // convert the data to a JSON string
                    const blob = new Blob([json], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = $el('a', {
                      href: url,
                      download: 'color_palette.json',
                      style: { display: 'none' },
                      parent: document.body
                    })
                    a.click()
                    setTimeout(function () {
                      a.remove()
                      window.URL.revokeObjectURL(url)
                    }, 0)
                  }
                }),
                $el('input', {
                  type: 'button',
                  value: 'Delete',
                  onclick: async () => {
                    let colorPaletteId = app.ui.settings.getSettingValue(
                      id,
                      defaultColorPaletteId
                    )

                    if (colorPalettes[colorPaletteId]) {
                      useToastStore().addAlert(
                        'You cannot delete a built-in color palette.'
                      )
                      return
                    }

                    if (colorPaletteId.startsWith('custom_')) {
                      colorPaletteId = colorPaletteId.substr(7)
                    }

                    await deleteCustomColorPalette(colorPaletteId)
                  }
                })
              ]
            )
          ])
        ])
      },
      defaultValue: defaultColorPaletteId,
      async onChange(value) {
        if (!value) {
          return
        }

        let palette = colorPalettes[value]
        if (palette) {
          await loadColorPalette(palette)
        } else if (value.startsWith('custom_')) {
          value = value.substr(7)
          let customColorPalettes = getCustomColorPalettes()
          if (customColorPalettes[value]) {
            palette = customColorPalettes[value]
            await loadColorPalette(customColorPalettes[value])
          }
        }

        let { BACKGROUND_IMAGE, CLEAR_BACKGROUND_COLOR } =
          palette.colors.litegraph_base
        if (
          BACKGROUND_IMAGE === undefined ||
          CLEAR_BACKGROUND_COLOR === undefined
        ) {
          const base = colorPalettes['dark'].colors.litegraph_base
          BACKGROUND_IMAGE = base.BACKGROUND_IMAGE
          CLEAR_BACKGROUND_COLOR = base.CLEAR_BACKGROUND_COLOR
        }
        // @ts-expect-error
        // litegraph.extensions.js
        app.canvas.updateBackground(BACKGROUND_IMAGE, CLEAR_BACKGROUND_COLOR)
      }
    })
  }
})
