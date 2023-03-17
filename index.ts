import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
const cors = require('cors');


import { appendContentAsync, createDocumentAsync, createTravelPlanAsync, getDatabaseAsync, getDocumentAsync, getDocumentChildrenAsync, updateDocumentAsync } from './src/notion';

const port = process.env.PORT;

const app: Express = express();
app.use(cors({ origin: '*' }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/database', async (request: Request, response: Response) => {
  const databaseResult = await getDatabaseAsync();
  response.send(databaseResult);
});

app.post('/api/v1/database', async (request: Request, response: Response) => {
  // const { name, status } = request.body as TravelPlan
  const creationResult = await createTravelPlanAsync({
    name: 'Travel to Europe',
    status: {
      id: '866a1a6b-b7d3-427f-989f-410c68177502',
      name: 'Planning',
      color: 'blue',
    },
    places: [
      {
        id: 'II=O',
        name: 'Tokyo',
        color: 'default',
      },
      {
        id: '61c2bdac-f00a-45bd-97bb-85db37e6c193',
        name: 'Kobe',
        color: 'yellow',
      },
    ],
  });
  response.send(creationResult);
});

/**DOCUMENT */
//---------Get documents------------
app.get('/api/v1/page', async (request: Request, response: Response) => {
  const documents = await fetch('http://[::1]:8001/documents').then(response => response.json()).then(documents => documents.reverse())
  response.send(documents.map((document: any) => ({ id: document.id, title: document.properties.title.title[0].plain_text })))
})

//---------Get document------------
app.get('/api/v1/page/:id', async (request: Request, response: Response) => {
  const document = await getDocumentAsync(request.params.id)
  response.send(document)
})

//---------Get document children------------
app.get('/api/v1/page/:id/children', async (request: Request, response: Response) => {
  const document = await getDocumentChildrenAsync(request.params.id)
  response.send(document)
})

//---------Create document------------
app.post('/api/v1/page/create', async (request: Request, response: Response) => {
  const creationResult: any = await createDocumentAsync(request.body)

  await fetch('http://[::1]:8001/documents', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(creationResult)
  })

  response.send({ id: creationResult.id, title: creationResult.properties.title.title[0].plain_text })
})

//---------Append content------------
app.post('/api/v1/page/append', async (request: Request, response: Response) => {
  const document = await appendContentAsync(request.body)
  response.send(document)
})

//---------Update document------------
app.put('/api/v1/page/update', async (request: Request, response: Response) => {
  const document = await updateDocumentAsync(request.body)
  console.log('http://[::1]:8001/documents/' + request.body.documentId) 
  await fetch('http://[::1]:8001/documents/' + request.body.documentId, {
    method: 'PUT',
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(document)
  })
  response.send(document)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
