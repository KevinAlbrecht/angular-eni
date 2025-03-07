import { getBoardWithMultipleColumns, getBoardWithOneColumn } from './mocks/board';

import { getTicketstMap, reorder } from '~board/helpers';
import { Board, DragDropLocation, Ticket } from '~board/models';

describe('helpers', () => {
  let boardWithOneColumn: Board;
  let boardWithMultipleColumns: Board;

  beforeEach(() => {
    boardWithOneColumn = structuredClone(getBoardWithOneColumn());
    boardWithMultipleColumns = structuredClone(getBoardWithMultipleColumns());
  });

  describe('getTicketstMap', () => {
    it('should return a map of tickets grouped by columnId', () => {
      const { columns, tickets } = boardWithMultipleColumns;

      const expectedMap = {
        column1: tickets.slice(0, 4),
        column2: tickets.slice(4, 6),
        column3: tickets.slice(6, 8),
      };
      const result = getTicketstMap(columns, tickets);

      expect(result).toEqual(expectedMap);
    });
  });

  describe('reorder', () => {
    it('should reorder the tickets when moving within the same column', () => {
      const { columns, tickets } = boardWithOneColumn;

      const from: DragDropLocation = { columnId: 'column1', ticketId: 'ticket1' };
      const to: DragDropLocation = { columnId: 'column1', ticketId: 'ticket2' };

      const result = reorder(from, to, tickets, columns);
      expect(result[0].order).toBe(2);
      expect(result[1].order).toBe(1);
      expect(result[2].order).toBe(3);
    });

    it('should reorder the tickets when moving between columns', () => {
      const { columns, tickets } = structuredClone(boardWithMultipleColumns);
      const from: DragDropLocation = { columnId: 'column1', ticketId: 'ticket1' };
      const to: DragDropLocation = { columnId: 'column2', ticketId: 'ticket5' };

      const expectedTicketList: Ticket[] = getBoardWithMultipleColumns().tickets.map((t) => {
        if (t.id === 'ticket1') {
          return { ...t, columnId: 'column2', order: 1 };
        } else if (t.columnId === 'column1') {
          return { ...t, order: t.order - 1 };
        } else if (t.columnId === 'column2') {
          return { ...t, order: t.order + 1 };
        } else {
          return t;
        }
      });

      const result = reorder(from, to, tickets, columns);
      expect(result).toEqual(expectedTicketList);
    });
  });
});
