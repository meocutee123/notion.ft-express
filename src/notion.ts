import { Client } from "@notionhq/client";
import { AppendParameters, Block, CreateParameters, TravelPlan, UpdateBlockChildrenParameters, UpdateBlockParameters, UpdateTitleParameters } from "./@types";

const NOTION_NAME_ID = 'title'
const NOTION_PLACES_ID = '6BZi'
const NOTION_PEOPLE_ID = 'G\'5H'
const NOTION_DATE_ID = 'VXfM'
const NOTION_STATUS_ID = 'uX%600'

const notion = new Client({ auth: process.env.NOTION_KEY })

export const getDatabaseAsync = async () => {
  const response = await notion.databases.retrieve({
    database_id: getNotionDatabaseConnection()
  })
  return response
}

export const createTravelPlanAsync = async (plan: TravelPlan) => {
  const response = await notion.pages.create({
    parent: { database_id: getNotionDatabaseConnection() },
    properties: {
      [NOTION_NAME_ID]: {
        title: [
          {
            type: 'text',
            text: {
              content: plan.name
            }
          }
        ]
      },
      [NOTION_STATUS_ID]: {
        select: { id: plan.status.id }
      },
      [NOTION_PLACES_ID]: {
        multi_select: plan.places.map(x => ({ id: x.id }))
      }
    }
  })

  return response
}

export const getDocumentAsync = async (pageId: string) => {
  const document = await notion.pages.retrieve({ page_id: pageId })

  return document
}

export const getDocumentChildrenAsync = async (pageId: string) => {
  return await listDocumentChildren(pageId)
}

export const createDocumentAsync = async (parameters: CreateParameters) => {
  const document = await notion.pages.create({
    parent: { page_id: parameters.parentId },
    properties: {
      title: {
        title: [
          {
            type: 'text',
            text: { content: parameters.title },
            annotations: parameters.annotations
          }
        ]
      }
    }
  });

  return document
}

export const appendContentAsync = async (appendParameters: AppendParameters) => {
  const children: any = appendParameters.content.map(line => ({
    type: 'text',
    text: { content: line }
  }))

  const document = await notion.blocks.children.append({
    block_id: appendParameters.pageId,
    children: [
      {
        object: "block",
        type: "quote",
        quote: {
          rich_text: children
        }
      },
    ]
  });

  return document
}

export const updateDocumentTitleAsync = async (updateParameters: UpdateTitleParameters) => {
  const response = await notion.pages.update({
    page_id: updateParameters.documentId,
    properties: {
      title: {
        title: [
          {
            type: 'text',
            text: { content: updateParameters.title }
          }
        ]
      }
    }
  })

  return response
}

export const updateBlockAsync = async (updateParameters: UpdateBlockChildrenParameters) => {
  try {
    return await updateBlockAlsoWithCreate(updateParameters.pageId, updateParameters.children)
    // await updateBlockChildren(updateParameters.pageId, updateParameters.children)
  } catch {
    console.log('We have some error here');

  }
}

const getNotionDatabaseConnection = () => {
  const identfier = process.env.NOTION_DATABASE_ID

  if (identfier === undefined) throw new Error('Database id not found!')
  return identfier
}

const updateBlockChildren = async (pageId: string, blocks: Block[]) => {
  const blockWithChildren = await listDocumentChildren(pageId)
  const operations = [];
  for (const block of blocks) {
    const update = blockWithChildren.results.find((item) => block.id === item.id);

    update
      ? operations.push(updateBlockAlsoWithCreate(pageId, block))
      : operations.push(appendBlock(pageId, block));
  }

  await Promise.all(operations);
}

const listDocumentChildren = async (blockId: string) => {
  return await notion.blocks.children.list({ block_id: blockId })
}

const updateBlockAlsoWithCreate = async (pageId: string, block: Block) => {
  const blocks = await listDocumentChildren(pageId)
  const update = blocks.results.find(x => x.id === block.id)

  return update
    ? await notion.blocks.update({ block_id: block.id, paragraph: block.paragraph })
    : await appendBlock(pageId, block)


}

const appendBlock = async (pageId: string, block: Block | undefined) => {
  if (block === undefined) return

  return await notion.blocks.children.append({
    block_id: pageId,
    children: [block]
  })
}

const retriveBlock = async (blockId: string) => await notion.blocks.retrieve({ block_id: blockId })




