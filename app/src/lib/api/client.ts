const API_URL =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_GATEWAY_URL ??
    process.env.NEXT_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
    token?: string;
}

export async function apiFetch<T>(
    path: string,
    //si no mandas options, se inicializa como {} para que no de error
    options: ApiFetchOptions = {}
    //T es el tipo de dato que se espera recibir
): Promise<T> {
    if (!API_URL) {
        throw new Error("API_URL no está configurada");
    }

    const { token, headers, ...rest } = options;

    //Se crea la peticion, se le pasa la url y las opciones, guardamos la respuesta en response
    const response = await fetch(`${API_URL}${path}`, {
        //rest son todas las opciones que se le pasan a fetch, como method, body, etc
        ...rest,
        headers: {
            //Lo que estoy enviando esta en formato JSON
            "Content-Type": "application/json",
            //si se manda un token, se agrega al header
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            //si se mandan headers, se agregan al header
            ...(headers ?? {}),
        },
    });

    //trae el json y lo convierte en un objeto, si falla, devuelve null
    const data = await response.json().catch(() => null);

    //si la respuesta no es ok, lanza un error
    if (!response.ok) {
        throw new Error(data?.message ?? "Ocurrió un error en la petición");
    }

    // se castea el tipo de dato que se espera recibir
    return data as T;
}
