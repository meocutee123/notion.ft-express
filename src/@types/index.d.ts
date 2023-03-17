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

export type UpdateParameters = {
  documentId: string,
  title: string
}