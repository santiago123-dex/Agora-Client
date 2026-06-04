"use client";

import Link from "next/link";

export default function ContactSection() {
    return (
        <section id="contacto" className="bg-[#EBF3F6] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold text-slate-950">
                    ¿Tenés preguntas?
                </h2>
                    <p className="mt-3 text-xl text-gray-500">
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                hola@agora.app
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#eaf3f8]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
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
