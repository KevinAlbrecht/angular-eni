import { Board } from './models';

export const allBoard: Board = {
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
};
