"use client"
import { useState } from "react";
import { ArrowLeft, Copy, UserRound } from "lucide-react";

const colors = [
    "#EAB308",
    "#84CC16",
    "#10B981",
    "#DC2626",
    "#2563EB",
    "#0EA5E9",
    "#A21CAF",
    "#EC4899",
];

const invitacionCode = "HJK3-02P7"
const currentAccount = {
    name: "Santiago Fajardo Morales",
    email: "santiago@gmail.com",
}

export default function DashboardHeader() {
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalJoin, setOpenModalJoin] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#48f");
    const [nombre, setNombre] = useState("");
    const [description, setDescription] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(invitacionCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("No se pudo copiar el código", error);
        }
    }


    return (
        <section className="w-full flex">
            <div className="flex flex-col gap-1 w-[70%] py-6 px-7">
                <h2 className="text-3xl font-bold">Bienvenido de vuelta</h2>
                <p className="text-gray-500">Aqui tienes un resumen de tu actividad</p>
            </div>
            <div className="w-[30%] flex items-center justify-end py-7 px-10 gap-3">
                <button onClick={() => setOpenModalJoin(true)} className="flex items-center gap-2 border border-[#d1d1d1] py-1 px-5 rounded-md font-medium hover:scale-105 hover:transition-all hover:duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg>
                    Unirse
                </button>
                <button onClick={() => setOpenModalCreate(true)} className="flex items-center justify-center gap-2 border border-[#275D79] bg-[#275D79] py-1 px-3 rounded-md text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Crear Espacio
                </button>

                {/*Modal de Ingresar a un espacio de trabajo*/}

                {openModalJoin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                        <div className="w-full max-w-220 bg-white p-6 shadow-lg rounded-xl">

                            <div className="relative flex items-center justify-center mb-2">
                                <button
                                    onClick={() => setOpenModalJoin(false)}
                                    className="absolute left-0 rounded-full p-2 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="h-6 w-6 text-black" />
                                </button>
                                <h2 className="text-xl font-medium text-center ">Unirse a un espacio</h2>
                            </div>

                            <div className="w-full flex flex-col items-center justify-center mt-4">
                                <div className="w-[80%] flex bg-[#eee] p-4 rounded-md">
                                    <div className="w-[50%] flex flex-col items-start justify-center p-4">
                                        <div className="text-center font-medium text-lg">
                                            <h2>Ingresa el codigo del espacio</h2>
                                        </div>
                                        <div className="mb-1 mt-1">
                                            <input
                                                type="text"
                                                value={invitacionCode ?? ""}
                                                readOnly
                                                placeholder="HUYS-1190"
                                                className="text-center mt-2 border border-[#d0d0d0] rounded-lg px-3 py-2 w-full focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="mt-3 flex justify-start">
                                            <button className="flex gap-2 items-center justify-start rounded border border-[#275D79] bg-[#275D79] px-4 py-1 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                                Unirse al espacio
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-[50%] flex flex-col items-center justify-center p-4">
                                        <div className="mb-3 w-full">
                                            <h2 className="text-[20px] font-semibold text-[#1c1c1c] text-center">Cuenta actual</h2>
                                        </div>

                                        <div className="flex w-full items-center justify-center gap-4">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#10C78B]">
                                                <UserRound className="h-7 w-7 text-[#4b4b4b]" strokeWidth={2.2} />
                                            </div>

                                            <div className="flex flex-col justify-center">
                                                <h3 className="text-[18px] font-semibold leading-6 text-[#1c1c1c]">
                                                    {currentAccount.name}
                                                </h3>
                                                <p className="mt-1 text-[14px] text-[#c4c4c4]">{currentAccount.email}</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-4 w-full rounded-xl bg-[#dddddd] px-4 py-3 text-[16px] font-semibold text-[#1c1c1c] transition-colors hover:bg-[#d3d3d3]"
                                        >
                                            Cambiar de cuenta
                                        </button>
                                    </div>
                                </div>

                                <div className="w-[80%] flex mt-7">
                                    <div className="w-[80%]">
                                        <p className="text-[14px] text-[#838383]">Para  ingresar a un espacio de trabajo debes pedir el código del espacio a  tu profesor.El código no debe tener simbolos ni espacios</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/*Modal de Ingresa a un espacio de trabajo*/}

                {openModalCreate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                        <div className="w-full max-w-150 bg-white p-6 shadow-lg rounded-xl">
                            <div className="mb-4 flex items-center justify-center relative">
                                <button
                                    onClick={() => setOpenModalCreate(false)}
                                    className="absolute left-0 rounded-full p-2 hover:bg-gray-100"
                                >
                                    <ArrowLeft className="h-6 w-6 text-black" />
                                </button>
                                <h2 className="text-xl font-medium text-center ">Crear espacio</h2>
                            </div>
                            <div className="border border-gray-400 rounded-xl p-4">
                                <div className="rounded-2xl border border-gray-300 bg-white overflow-hidden">
                                    <div className="h-16 w-full" style={{ backgroundColor: selectedColor }} />
                                    <div className="px-3 py-2">
                                        <h3 className="font-semibold text-lg">
                                            {nombre || "Nombre del espacio"}
                                        </h3>
                                        <p className="mb-2">
                                            {description || "Descripción del espacio de trabajo"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <label>Nombre del espacio</label>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Nombre del espacio"
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-[#eee] py-2 px-3 focus:outline-none"
                                    />
                                    <label>Descripción</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Escribe la descripcion para tu espacio de trabajo"
                                        className="w-full rounded-lg border border-gray-300 bg-[#eee] py-2 px-3 h-20 outline-none"
                                    />
                                </div>
                                <div className="mt-5 flex items-center gap-3 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`h-8 w-8 rounded-md border-2 ${selectedColor === color ? "border-blue-500" : "border-transparent"}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <div className="relative mt-4 border border-gray-300 bg-[#eee] p-3 rounded-lg">
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 rounded-full p-2 hover:bg-gray-100"
                                        onClick={handleCopy}
                                    >
                                        <Copy className="h-5 w-5 text-black" />
                                    </button>
                                    {copied && (
                                        <span className="absolute right-3 top-14 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                            Código copiado
                                        </span>
                                    )}
                                    <div className="w-[80%] flex flex-col gap-2">
                                        <h3 className="font-semibold">Código de invitación</h3>
                                        <input
                                            type="text"
                                            value={invitacionCode ?? ""}
                                            readOnly
                                            placeholder="HUYS-1190"
                                            className="border border-[#d0d0d0] rounded-lg p-3 w-[70%] focus:outline-none"
                                            required
                                        />
                                        <p className="text-[13px] text-gray-500">Comparte este código para unir usuarios al espacio de trabajo</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-start gap-2">
                                    <button className="flex gap-2 items-center justify-center rounded border border-[#275D79] bg-[#275D79] px-3 py-1 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                        Crear Espacio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </section>
    )
}
