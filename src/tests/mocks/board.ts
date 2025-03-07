import { Board, Ticket, TicketEditionCreation } from '~board/models';

const boardWithOneColumn: Board = {
  columns: [{ id: 'column1', title: 'Column 1', order: 1 }],
  tickets: [
    {
      id: 'ticket1',
      columnId: 'column1',
      order: 1,
      title: 'Ticket 1',
      description: 'Description 1',
      type: 'bug',
    },
    {
      id: 'ticket2',
      columnId: 'column1',
      order: 2,
      title: 'Ticket 2',
      description: 'Description 2',
      type: 'feature',
    },
    {
      id: 'ticket3',
      columnId: 'column1',
      order: 3,
      title: 'Ticket 3',
      description: 'Description 3',
      type: 'task',
    },
    {
      id: 'ticket4',
      columnId: 'column1',
      order: 4,
      title: 'Ticket 4',
      description: 'Description 4',
      type: 'bug',
    },
  ],
};

const boardWithMultipleColumns: Board = {
  columns: [
    { id: 'column1', title: 'Column 1', order: 1 },
    { id: 'column2', title: 'Column 2', order: 2 },
    { id: 'column3', title: 'Column 3', order: 3 },
  ],
  tickets: [
    {
      id: 'ticket1',
      columnId: 'column1',
      order: 1,
      title: 'Ticket 1',
      description: 'Description 1',
      type: 'bug',
    },
    {
      id: 'ticket2',
      columnId: 'column1',
      order: 2,
      title: 'Ticket 2',
      description: 'Description 2',
      type: 'feature',
    },
    {
      id: 'ticket3',
      columnId: 'column1',
      order: 3,
      title: 'Ticket 3',
      description: 'Description 3',
      type: 'task',
    },
    {
      id: 'ticket4',
      columnId: 'column1',
      order: 4,
      title: 'Ticket 4',
      description: 'Description 4',
      type: 'bug',
    },
    {
      id: 'ticket5',
      columnId: 'column2',
      order: 1,
      title: 'Ticket 5',
      description: 'Description 5',
      type: 'bug',
    },
    {
      id: 'ticket6',
      columnId: 'column2',
      order: 2,
      title: 'Ticket 6',
      description: 'Description 6',
      type: 'feature',
    },
    {
      id: 'ticket7',
      columnId: 'column3',
      order: 3,
      title: 'Ticket 7',
      description: 'Description 7',
      type: 'task',
    },
    {
      id: 'ticket8',
      columnId: 'column3',
      order: 4,
      title: 'Ticket 8',
      description: 'Description 8',
      type: 'bug',
    },
  ],
};

const simpleTicket: Ticket = {
  id: 'ticket1',
  columnId: 'column1',
  order: 1,
  title: 'Ticket 1',
  description: 'Description 1',
  type: 'bug',
  assignee: 'John Doe',
};

const editionTicket: TicketEditionCreation = {
  id: 'ticketId2',
  title: 'ticketName2',
  description: 'ticketDescription2',
  type: 'feature',
  assignee: 'assigneeId2',
  columnId: 'columnId2',
};

const creationTicket: TicketEditionCreation = {
  id: undefined,
  title: 'ticketName2',
  description: 'ticketDescription2',
  type: 'feature',
  assignee: 'assigneeId2',
  columnId: 'columnId2',
};

export const getBoardWithOneColumn = () => structuredClone(boardWithOneColumn);
export const getBoardWithMultipleColumns = () => structuredClone(boardWithMultipleColumns);
export const getSimpleTicket = () => structuredClone(simpleTicket);
export const getEditionTicket = () => structuredClone(editionTicket);
export const getCreationTicket = () => structuredClone(creationTicket);
