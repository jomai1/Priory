# Priory


# Calculate Priority
Change index of ticket. Then update the priority score (update all?).


## Events
# Record drag event in uiStore
Note the “Drag” event and do not allow the subsequent click event
```js
  @mousedown="uiStore.onMouseDown"
  @mouseup="uiStore.onMouseUp"
  @click="uiStore.someFN" // someFN needs to check if isDragging is set!
```



## Thoughts about task data structure

{
  "title": "Something else....",
  "description": "Finish and submit the final project report by the deadline.",
  "sub_tasks": [
  	{
      "title": "Research topic",
      "status": "pending"
    },
    {
      "title": "Write Title",
      "status": "pending"
    },
    {
      "title": "Write Report body",
      "status": "pending"
    }
    ],
  "deadline": "2024-07-20T23:59:00Z",
  "urgency": 3,
  "benefit": 2,
  "effort": 5,
  "cost": 2,
  "time_required": 603,
  "categories": ["Professional", "High Priority"],
  "dependencies": [
  	{
      "task_id": "121a0c3d-5ef7-467a-837a-bea190ef1167",
      "type": "before"
    },
    {
      "task_id": "0bd022da-03cf-453f-a413-4aabbe7abb72",
      "type": "after"
  	},
    {
      "task_id": "0bd022da-33cf-453f-a413-4aabbe7abb72",
      "type": "no_order"
  	}
  ]
}