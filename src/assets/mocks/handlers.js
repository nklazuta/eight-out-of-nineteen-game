import { http, HttpResponse } from 'msw';

const handlers = [
  http.post('/api/tickets', async ({ request }) => {
    const requestBody = await request.json();

    if (!requestBody.data) return HttpResponse.json({ msg: 'Bad Request' }, { status: 400 });

    return HttpResponse.json(
      {
        content: requestBody.data,
      },
      { status: 201 },
    );
  }),
];

export default handlers;
