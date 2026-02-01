// Task status constants matching frontend Kanban columns
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress', 
  REVIEW: 'review',
  DONE: 'done'
};

// Valid status transitions
export const VALID_STATUS_TRANSITIONS = {
  [TASK_STATUS.TODO]: [TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.TODO, TASK_STATUS.REVIEW],
  [TASK_STATUS.REVIEW]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE],
  [TASK_STATUS.DONE]: [TASK_STATUS.REVIEW]
};

// Status display names
export const STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.DONE]: 'Done'
};

// Kanban column configuration
export const KANBAN_COLUMNS = [
  { id: TASK_STATUS.TODO, title: STATUS_LABELS[TASK_STATUS.TODO] },
  { id: TASK_STATUS.IN_PROGRESS, title: STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
  { id: TASK_STATUS.REVIEW, title: STATUS_LABELS[TASK_STATUS.REVIEW] },
  { id: TASK_STATUS.DONE, title: STATUS_LABELS[TASK_STATUS.DONE] }
];