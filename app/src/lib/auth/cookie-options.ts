

export const authCookieOptions = {
    // solo se puede acceder a la cookie desde el servidor
    httpOnly: true,
    // solo se puede acceder a la cookie desde https en Vercel.
    // En localhost con `next start`, NODE_ENV también es "production",
    // pero una cookie secure no se guarda/envía por http://localhost.
    secure: process.env.VERCEL === "1",
    // controla cuándo el navegador envía la cookie si la petición viene desde otro sitio/origen.
    // esto quiere decir que lax no va a enviar la cookie si la peticion viene desde otro sitio
    sameSite: "lax" as const,
    // La cookie se envía en requests a cualquier ruta del dominio
    path: "/",
};
