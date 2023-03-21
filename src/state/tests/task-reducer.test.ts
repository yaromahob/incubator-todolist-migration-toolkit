import {
  changeTaskStatus,
  deleteTasks, fetchTasks,
  tasksReducer,
  TasksStateType, updateTaskTitle
} from "../task-reducer";
import {TaskPrioritiesType, TaskStatusesType} from "../../api/task-api";
import {createTodoList} from "../todolist-reducer";


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
  // const action = fetchTasks.fulfilled({
  //   tasks: startState[todolistID1],
  //   todolistID: todolistID1
  // }, 'requestID', todolistID1);
  //
  // const endState = tasksReducer({todolistID1: [], todolistID2: []}, action);
  //
  // expect(endState[todolistID1].length).toBe(3);
  // expect(endState[todolistID2].length).toBe(0);
});

test('correct task should be deleted from array', () => {
  // const param = {taskId: '2', todolistId: todolistID2};
  // const action = deleteTasks.fulfilled(param, 'requestID', param);
  // const endState = tasksReducer(startState, action);
  //
  // expect(endState[todolistID1].length).toBe(3);
  // expect(endState[todolistID2].length).toBe(2);
  // expect(endState[todolistID2].every(t => t.id !== '2')).toBeTruthy();
});


test('status of specified task should be changed', () => {
  // const action = changeTaskStatus({todolistId: todolistID1, taskID: '1', status: TaskStatusesType.Completed});
  //
  // const endState = tasksReducer(startState, action);
  //
  // expect(endState[todolistID1][1].status).toBe(TaskStatusesType.Completed);
  // expect(endState[todolistID2][1].status).toBe(TaskStatusesType.New);
});

test('title of specified task should be changed', () => {
//   const action = updateTaskTitle({todolistId: todolistID2, taskID: '2', title: 'HOROSHO', });
//
//   const endState = tasksReducer(startState, action);
//
//   expect(endState[todolistID1][1].title).toBe('JS');
//   expect(endState[todolistID2][1].title).toBe('HOROSHO');
//   expect(endState[todolistID2][0].title).toBe('bread');
// });
//
// test('new array should be added when new todolist is added', () => {
//   const newTodolistID = 'newTodolistID';
//   const action = createTodoList({title: 'new-todolist', todolistId: newTodolistID});
//
//   const endState = tasksReducer(startState, action);
//
//   const keys = Object.keys(endState);
//   const newKey = keys.find(k => k !== todolistID1 && k !== todolistID2);
//   if (!newKey) {
//     throw Error('new key should be added');
//   }
//   expect(keys.length).toBe(3);
//   expect(endState[newKey]).toEqual([]);
});
