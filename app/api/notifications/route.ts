import { NextResponse } from "next/server";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const store: NotificationData[] = [
  {
    id: "seed-1",
    title: "Bienvenido a Agora",
    description: "Tu espacio de trabajo está listo. Empezá creando tu primera tarea.",
    time: "ahora",
    read: false,
  },
];

let nextId = 100;

export async function GET() {
  return NextResponse.json({ notifications: store.slice().reverse() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Faltan campos requeridos: title, description" },
        { status: 400 },
      );
    }

    const notification: NotificationData = {
      id: String(nextId++),
      title,
      description,
      time: "ahora",
      read: false,
    };

    store.push(notification);

    return NextResponse.json({ notification }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Error al crear notificación" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body as { ids?: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "Se requiere un array de ids" }, { status: 400 });
    }

    for (const n of store) {
      if (ids.includes(n.id)) {
        n.read = true;
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Error al actualizar notificaciones" }, { status: 400 });
  }
}
