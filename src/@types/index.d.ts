export type TravelPlan = {
  name: string,
  status: Option,
  places: Place[]
}

type Option = {
  id: string,
  name: string,
  color: string
}

type Place = {
  id: string,
  name: string,
  color: string
}

export type CreateParameters = {
  parentId: string,
  title: string,
  link?: string,
  annotations?: {
    bold?: boolean,
    italic?: boolean,
    strikethrough?: boolean,
    underline?: boolean,
    code?: boolean,
    color?: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";
  }
}

export type AppendParameters = {
  pageId: string,
  content: string[]
}

export type UpdateTitleParameters = {
  documentId: string,
  title: string
}

export type UpdateBlockChildrenParameters = {
  pageId: string,
  children: Block
}

export type UpdateBlockParameters = {

}

type Block = {
  id: string,
  paragraph: BlockContent
}

type BlockContent = {
  rich_text: [
    {
      type: 'text',
      text: { content: string }
    }
  ]
}