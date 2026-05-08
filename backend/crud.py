from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/todos", tags=["todos"])

todos = []  # In-memory storage for todos

class Todo(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: bool = False

@router.get("/", response_model=List[Todo])
async def get_todos():
    return todos

@router.get("/{todo_id}", response_model=Todo)
async def get_todo(todo_id: int):
    todo = next((todo for todo in todos if todo["id"] == todo_id), None)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.post("/", response_model=Todo)
async def create_todo(todo: Todo):
    new_id = max([t["id"] for t in todos] + [0]) + 1
    new_todo = {"id": new_id, "title": todo.title, "description": todo.description, "completed": todo.completed}
    todos.append(new_todo)
    return new_todo

@router.put("/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, updated_todo: Todo):
    for index, todo in enumerate(todos):
        if todo["id"] == todo_id:
            todos[index] = updated_todo.dict()
            return todos[index]
    raise HTTPException(status_code=404, detail="Todo list not found")

@router.delete("/{todo_id}")
async def delete_todo(todo_id: int):
    global todos
    initial_length = len(todos)
    todos = [todo for todo in todos if todo["id"] != todo_id]
    if len(todos) == initial_length:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return {"message": "Todo deleted successfully"}


