"use client"
import Link from "next/link";
import { useState } from "react";


export default function DashboardHeader() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#48f");


    return (
        <section className="w-full flex">
            <div className="flex flex-col gap-1 w-[70%] py-6 px-7">
                <h2 className="text-3xl font-bold">Bienvenido de vuelta</h2>
                <p className="text-gray-500">Aqui tienes un resumen de tu actividad</p>
            </div>
            <div className="w-[30%] flex items-center justify-end py-7 px-10 gap-3">
                <Link href="/" className="flex items-center gap-2 border border-[#d1d1d1] py-1 px-5 rounded-md font-medium hover:scale-105 hover:transition-all hover:duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg>
                    Unirse
                </Link>
                <button onClick={() => setOpenModal(true)} className="flex items-center justify-center gap-2 border border-[#275D79] bg-[#275D79] py-1 px-3 rounded-md text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Crear Espacio
                </button>

                {openModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                        <div className="w-full max-w-130 bg-white p-6 shadow-lg">
                            <h2 className="text-xl font-medium text-center mb-2">Crear espacio</h2>
                            <div className="border border-gray-400 rounded-xl p-4">
                                <div className="rounded-t-2xl rounded-b-2xl border border-gray-300 bg-white overflow-hidden">
                                    <div className="h-16 w-full" style={{ backgroundColor : selectedColor }} />
                                    <div className="h-16 w-full">
                                        
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <label>Nombre del espacio</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre del espacio"
                                        className="w-full rounded-lg border border-gray-500 bg-gray-300 p-2"
                                    />
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className="rounded bg-gray-300 px-4 py-2"
                                    >
                                        Cerrar
                                    </button>
                                    <button className="rounded bg-blue-600 px-4 py-2 text-white">
                                        Crear
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
