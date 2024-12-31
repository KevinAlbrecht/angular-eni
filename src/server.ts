/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, createServer, Response, Request, hasMany, belongsTo } from 'miragejs';
import type Schema from 'miragejs/orm/schema';

import { DragDropLocation } from '~board/models';

let server;
const userSessions: Record<string, { expires: number; isAdmin: boolean }> = {};

const HARDCODED_TOKENS = {
  admin: 'admin-fake-token',
  user: 'user-fake-token',
};

function getColumnsAndTickets(schema: Schema<any>) {
  const columns = schema.db['columns'];
  const tickets = schema.db['tickets'];

  return { columns, tickets };
}

function shiftTickets(schema: Schema<any>, whereFn: (t: any) => any, isShift = true) {
  (schema as any)['tickets'].where(whereFn).models.forEach((ticket: any) => {
    schema.db['tickets'].update(ticket.id, {
      order: ticket.order + (isShift ? 1 : -1),
    });
  });
}

function checkAuthToken(request: Request) {
  const auth = request.requestHeaders['Authorization'];
  if (!auth) {
    return null;
  }

  const token = auth.split(' ')[1] || '';
  return userSessions[token] || null;
}

export default function initServer() {
  server = createServer({
    models: {
      column: Model.extend({
        tickets: hasMany(),
      }),
      ticket: Model.extend({
        column: belongsTo(),
      }),
    },

    seeds(server) {
      server.db.loadData({
        columns: [
          {
            id: '1',
            title: 'To Do',
            order: 1,
          },
          {
            id: '2',
            title: 'In progress',
            order: 2,
          },
          {
            id: '3',
            title: 'Done',
            order: 3,
          },
        ],
        tickets: [
          {
            id: '1',
            title: 'Create a new project',
            description: 'Create a new project with Angular CLI',
            type: 'feature',
            assignee: 'John Snow',
            order: 1,
            columnId: '1',
          },
          {
            id: '2',
            title: 'Add Feature 2',
            description: 'Add Feature 2',
            type: 'feature',
            order: 2,
            columnId: '1',
          },
          {
            id: '3',
            title: 'Bug: Fix the issue',
            description: 'Bug: Fix the issue',
            type: 'bug',
            order: 3,
            columnId: '1',
          },
          {
            id: '4',
            title: 'Bug: Fix the critical issue',
            description: 'Bug: Fix the critical issue',
            type: 'bug',
            order: 1,
            columnId: '2',
          },
          {
            id: '5',
            title: 'First Task',
            description: 'Complete the first task',
            type: 'task',
            order: 1,
            columnId: '3',
          },
          {
            id: '6',
            title: 'Second Task',
            description: 'Complete the second task',
            type: 'task',
            order: 2,
            columnId: '3',
          },
        ],
      });
    },

    routes() {
      this.namespace = '/api';

      this.get('/board', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const board = getColumnsAndTickets(schema);
        return new Response(200, {}, { board });
      });

      this.patch('/board/ticket/reorder/:ticketId', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const ticketId = request.params['ticketId'];

        const { to } = JSON.parse(request.requestBody) as {
          to: DragDropLocation;
        };

        if (ticketId === to.ticketId) return new Response(400, {}, { error: 'Initial place' });

        const fromTicket = schema.db['tickets'].find(ticketId);

        if (!to.ticketId) {
          schema.db['tickets'].update(ticketId, {
            columnId: to.columnId,
            order: 1,
          });

          shiftTickets(
            schema,
            (t: any) => t.columnId === fromTicket.columnId && t.order >= fromTicket.order,
            false
          );
        } else {
          const toTicket = schema.db['tickets'].find(to.ticketId);

          const areSameColumn = fromTicket.columnId === toTicket.columnId;
          const isDesc = toTicket.order > fromTicket.order;

          if (!areSameColumn) {
            shiftTickets(
              schema,
              (t: any) => t.columnId === fromTicket.columnId && t.order >= fromTicket.order,
              false
            );
            shiftTickets(
              schema,
              (t: any) => t.columnId === toTicket.columnId && t.order >= toTicket.order
            );
          } else {
            const predicate = isDesc
              ? (t: any) =>
                  t.columnId === toTicket.columnId &&
                  t.order <= toTicket.order &&
                  t.order >= fromTicket.order
              : (t: any) =>
                  t.columnId === toTicket.columnId &&
                  t.order >= toTicket.order &&
                  t.order <= fromTicket.order;

            shiftTickets(schema, predicate, !isDesc);
          }

          schema.db['tickets'].update(fromTicket.id, {
            columnId: to.columnId,
            order: toTicket.order,
          });
        }

        const board = getColumnsAndTickets(schema);
        return new Response(200, {}, { board });
      });

      this.post('/board/ticket/:columnId', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const columnId = request.params['columnId'];
        const body = JSON.parse(request.requestBody);

        const createdTicket = schema.db['tickets'].insert({
          order: schema.db['tickets'].where({ columnId }).length + 1,
          columnId,
          ...body.ticket,
        });

        return new Response(200, {}, { ticket: createdTicket });
      });

      this.patch('/board/ticket', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const body = JSON.parse(request.requestBody);

        const updatedTicket = schema.db['tickets'].update(body.ticket.id, body.ticket);

        return new Response(200, {}, { ticket: updatedTicket });
      });

      this.get('/board/ticket/:id', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const ticketId = request.params['id'];

        const ticket = schema.db['tickets'].find(ticketId);
        if (!ticket) {
          return new Response(404, {}, { error: 'Not found' });
        }
        return new Response(200, {}, { ticket });
      });

      this.post(
        '/login',
        (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const expiry = Date.now() + 1000 * 60 * 60;

          if (body.email === 'admin@test.com' && body.password === '1234') {
            userSessions[HARDCODED_TOKENS.admin] = {
              expires: expiry,
              isAdmin: true,
            };

            return new Response(
              200,
              {},
              {
                user: { username: 'Marc', isAdmin: true },
                authToken: HARDCODED_TOKENS.admin,
              }
            );
          } else if (body.email === 'user@test.com' && body.password === '1234') {
            userSessions[HARDCODED_TOKENS.user] = {
              expires: expiry,
              isAdmin: false,
            };

            return new Response(
              200,
              {},
              {
                user: { username: 'John', isAdmin: false },
                authToken: HARDCODED_TOKENS.user,
              }
            );
          }

          return new Response(401, {}, { error: 'Unauthorized' });
        },
        { timing: 1000 }
      );

      this.post('/logout', (schema, request) => {
        const auth = request.requestHeaders['Authorization'];
        delete userSessions[auth];
        return new Response(200);
      });
    },
  });

  return server;
}
