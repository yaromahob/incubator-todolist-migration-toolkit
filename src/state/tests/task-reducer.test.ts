import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC, deleteTasks, fetchTasks,
  tasksReducer,
  TasksStateType
} from "../task-reducer";
import {TaskPrioritiesType, TaskStatusesType} from "../../api/task-api";
import {addTodolistAC} from "../todolist-reducer";


let todolistID1 = 'todolistID1';
let todolistID2 = 'todolistID2';

let startState: TasksStateType = {};

beforeEach(() => {
  startState = {
    todolistID1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatusesType.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPrioritiesType.Low,
        entityStatus: 'idle'
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatusesType.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 1,
        priority: TaskPrioritiesType.Low,
        entityStatus: 'idle'
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatusesType.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 2,
        priority: TaskPrioritiesType.Low,
        entityStatus: 'idle'
      },
    ],
    todolistID2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatusesType.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPrioritiesType.Low,
        entityStatus: 'idle'
      },
      {
        id: '2',
        title: 'bread',
        status: TaskStatusesType.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 1,
        priority: TaskPrioritiesType.Low,
        entityStatus: 'idle'
      },
      {
        id: '3',
        title: 'bread',
        status: TaskStatusesType.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 2,
        priority: TaskPrioritiesType.Low,
        entityStatus: 'idle'
      },
    ]
  };
});

test('tasks should be added for todolist', () => {
  const action = fetchTasks.fulfilled({
    tasks: startState[todolistID1],
    todolistID: todolistID1
  }, 'requestID', todolistID1);
  
  const endState = tasksReducer({todolistID1: [], todolistID2: []}, action);
  
  expect(endState[todolistID1].length).toBe(3);
  expect(endState[todolistID2].length).toBe(0);
});

test('correct task should be deleted from array', () => {
  const param = {taskId: '2', todolistId: todolistID2};
  const action = deleteTasks.fulfilled(param, 'requestID', param);
  const endState = tasksReducer(startState, action);
  
  expect(endState[todolistID1].length).toBe(3);
  expect(endState[todolistID2].length).toBe(2);
  expect(endState[todolistID2].every(t => t.id !== '2')).toBeTruthy();
});

test('correct task should be added to correct array', () => {
  const task = {
    addedDate: "2023-01-09T16:37:03.907",
    deadline: '',
    description: '',
    id: "8793b54f-6b68-4486-bf07-203dc35a190b",
    order: -2,
    priority: 1,
    startDate: '',
    status: 0,
    title: "MILK",
    todoListId: "76d85b11-409e-46af-8fc7-67ad4aadbc0f",
  };
  const action = addTaskAC({
    todolistID: todolistID2,
    task: task
  });
  const endState = tasksReducer(startState, action);
  
  expect(endState[todolistID1].length).toBe(3);
  expect(endState[todolistID2].length).toBe(4);
  expect(endState[todolistID2][0].id).toBeDefined();
  expect(endState[todolistID2][0].title).toBe('MILK');
  expect(endState[todolistID2][0].status).toBe(TaskStatusesType.New);
});

test('status of specified task should be changed', () => {
  const action = changeTaskStatusAC({todolistId: todolistID1, taskID: '1', status: TaskStatusesType.Completed});
  
  const endState = tasksReducer(startState, action);
  
  expect(endState[todolistID1][1].status).toBe(TaskStatusesType.Completed);
  expect(endState[todolistID2][1].status).toBe(TaskStatusesType.New);
});

test('title of specified task should be changed', () => {
  const action = changeTaskTitleAC({taskID: '2', title: 'HOROSHO', todolistId: todolistID2});
  
  const endState = tasksReducer(startState, action);
  
  expect(endState[todolistID1][1].title).toBe('JS');
  expect(endState[todolistID2][1].title).toBe('HOROSHO');
  expect(endState[todolistID2][0].title).toBe('bread');
});

test('new array should be added when new todolist is added', () => {
  const newTodolistID = 'newTodolistID';
  const action = addTodolistAC({title: 'new-todolist', todolistId: newTodolistID});
  
  const endState = tasksReducer(startState, action);
  
  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== todolistID1 && k !== todolistID2);
  if (!newKey) {
    throw Error('new key should be added');
  }
  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
