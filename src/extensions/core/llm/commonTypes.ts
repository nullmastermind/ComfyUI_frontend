export type NodeData = {
  input: {
    required?: {
      [key: string]: [
        string,
        {
          multiline?: boolean
          requireInput?: boolean
          dynamic?: boolean
          defaultInput?: boolean
        }
      ]
    }
    optional?: {
      [key: string]: [
        string,
        {
          multiline?: boolean
          requireInput?: boolean
          dynamic?: boolean
          defaultInput?: boolean
        }
      ]
    }
    hidden: Record<any, any>
  }
  input_order: {
    required: string[]
    hidden: string[]
  }
  output: string[]
  output_is_list: boolean[]
  output_name: string[]
  name: string
  display_name: string
  description: string
  python_module: string
  category: string
  output_node: boolean
}
