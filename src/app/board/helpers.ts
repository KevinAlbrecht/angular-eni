import { Column, DragDropLocation, Ticket } from './models';

export function getTicketstMap(columns: Column[], tickets: Ticket[]) {
  const draftMap: Record<string, Ticket[]> = {};

  for (let ticket of tickets) {
    if (!draftMap[ticket.columnId]) {
      draftMap[ticket.columnId] = [];
    }
    const columnId = ticket.columnId;
    draftMap[columnId].push(ticket);
  }

  for (let { id } of columns) {
    const currentColumn = draftMap[id];
    if (!currentColumn) {
      draftMap[id] = [];
    } else currentColumn.sort((a, b) => a.order - b.order);
  }

  return draftMap;
}

export function reorder(
  from: DragDropLocation,
  to: DragDropLocation,
  ticketList: Ticket[],
  columns: Column[]
) {
  function shift(arr: Ticket[], isUp: boolean, fromId: number = 0, toId: number = arr.length) {
    for (let ticket of arr) {
      if (ticket.order >= fromId && ticket.order <= toId) {
        ticket.order += isUp ? 1 : -1;
      }
    }
  }
  ticketList = ticketList.map((t) => ({ ...t }));

  const ticketsMap = getTicketstMap(columns, ticketList);
  const fromTicket = ticketsMap[from.columnId].find((t) => t.id === from.ticketId);
  const toTicket = ticketsMap[to.columnId].find((t) => t.id === to.ticketId);
  const newOrder = toTicket?.order || 1;
  if (!fromTicket) return ticketList;
  if (from.columnId !== to.columnId) {
    shift(ticketsMap[from.columnId], false, fromTicket.order);
    shift(ticketsMap[to.columnId], true, newOrder);
  } else {
    const isGoingUp = fromTicket.order > newOrder;
    shift(
      ticketsMap[to.columnId],
      isGoingUp,
      Math.min(fromTicket.order, newOrder),
      Math.max(fromTicket.order, newOrder)
    );
  }

  fromTicket.order = newOrder;
  fromTicket.columnId = to.columnId;

  return ticketList;
}
