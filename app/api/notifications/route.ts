import { NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const store = new Map<string, NotificationData[]>();
let nextId = 100;

async function getUserId(): Promise<string | null> {
  const token = await getAccessTokenFromCookies();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ notifications: [] });
  }
  const userNotifications = store.get(userId) ?? [];
  return NextResponse.json({ notifications: userNotifications.slice().reverse() });
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { message: "No hay sesión activa" },
        { status: 401 },
      );
    }

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

    const userNotifications = store.get(userId) ?? [];
    userNotifications.push(notification);
    store.set(userId, userNotifications);

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
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { message: "No hay sesión activa" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { ids } = body as { ids?: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "Se requiere un array de ids" }, { status: 400 });
    }

    const userNotifications = store.get(userId) ?? [];
    for (const n of userNotifications) {
      if (ids.includes(n.id)) {
        n.read = true;
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Error al actualizar notificaciones" }, { status: 400 });
  }
}