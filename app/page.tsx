"use client";

import { useEffect, useState, type FormEvent } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "テスト", completed: false },
  ]);
  const [text, setText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (!saved) {
      setIsLoaded(true);
      return;
    }

    try {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setTasks(parsed as Task[]);
      }
    } catch {
      // 保存データが壊れているときは、今の初期値のままにする
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [isLoaded, tasks]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = text.trim();
    if (!next) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), text: next, completed: false },
    ]);
    setText("");
  }

  function deleteTask(targetId: number) {
    setTasks((current) => current.filter((task) => task.id !== targetId));
  }

  function toggleTask(targetId: number) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== targetId) {
          return task;
        }

        return { ...task, completed: !task.completed };
      }),
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 text-gray-900 shadow-md">
        <h1 className="text-3xl font-bold">ToDo</h1>

        <form onSubmit={addTask} className="flex gap-3">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="タスクを入力"
            aria-label="タスクを入力"
            className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            追加
          </button>
        </form>

        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 border-b border-gray-200 py-3 last:border-b-0"
            >
              <span className={task.completed ? "text-gray-400 line-through" : ""}>
                {task.text}
                {task.completed ? " - 完了" : " - 未完了"}
              </span>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                >
                  切り替え
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
