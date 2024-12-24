type TicketType = 'bug' | 'feature' | 'task';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  assignee?: string;
  order: number;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
  order: number;
};

export type ColumnWithTickets = Column & { tickets: Ticket[] };

export type Board = { columns: Column[]; tickets: Ticket[] };
export type BoardGroupped = {
  columns: Column[];
  tickets: Record<string, Ticket[]>;
};

export type DragDropLocation = {
  columnId: string;
  ticketId: string;
};

export type DragDropPayload = [DragDropLocation, DragDropLocation];

export type GetBoardResponse = { board: Board };
export type CreateTicketResponse = { createdTicket: Ticket };
