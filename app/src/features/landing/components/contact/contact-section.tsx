"use client";

import Link from "next/link";
import { Mail, Phone, Globe, Camera, AtSign } from "lucide-react";

export default function ContactSection() {
    return (
        <section id="contacto" className="bg-[#EBF3F6] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="serif text-4xl tracking-tight text-slate-950">
                    ¿Tenés preguntas?
                </h2>
                    <p className="mt-3 text-xl text-slate-500">
                    Estamos acá para ayudarte a vos y a tu institución.
                    </p>
                </div>

                <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-950">
                            Contacto directo
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Escribinos y te respondemos en menos de 24 hs.
                        </p>

                        <div className="mt-6 space-y-4">
                            <a
                                href="mailto:hola@agora.app"
                                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#eaf3f8]"
                            >
                                <Mail size={18} className="text-[#275D79]" />
                                hola@agora.app
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#eaf3f8]"
                            >
                                <Phone size={18} className="text-[#275D79]" />
                                +54 11 5555-0202
                            </a>
                        </div>

                        <div className="mt-8">
                            <p className="mb-3 text-sm font-medium text-slate-700">Seguinos</p>
                            <div className="flex gap-3">
                                <Link
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79]"
                                >
                                    <Globe size={18} />
                                </Link>
                                <Link
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79]"
                                >
                                    <Camera size={18} />
                                </Link>
                                <Link
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79]"
                                >
                                    <AtSign size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-950">
                            Plan Institucional
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            ¿Representás una institución? Contanos tus necesidades y armamos un plan a medida.
                        </p>

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="mt-6 space-y-4"
                        >
                            <div>
                                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Nombre completo
                                </label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Correo electrónico
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    placeholder="tu@institucion.edu"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Mensaje
                                </label>
                                <textarea
                                    id="contact-message"
                                    rows={3}
                                    placeholder="Contanos sobre tu institución y qué necesitás..."
                                    className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const form = (e.target as HTMLButtonElement).closest("form");
                                    if (!form) return;
                                    const name = (form.querySelector("#contact-name") as HTMLInputElement)?.value;
                                    const email = (form.querySelector("#contact-email") as HTMLInputElement)?.value;
                                    const message = (form.querySelector("#contact-message") as HTMLTextAreaElement)?.value;
                                    if (!name || !email || !message) return;
                                    window.location.href = `mailto:hola@agora.app?subject=Plan Institucional - ${encodeURIComponent(name)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`)}`;
                                }}
                                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#275D79] text-sm font-semibold text-white shadow-lg shadow-[#275D79]/20 transition hover:bg-[#1f4a61]"
                            >
                                Enviar consulta
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
