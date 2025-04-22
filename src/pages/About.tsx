

function About(){
    return(
        <>
         <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Sobre Mí 🚀</h1>
            <p className="text-lg mb-4">
                ¡Hola! Soy <span className="font-semibold text-blue-400">Javier</span>, un desarrollador freelance apasionado por crear aplicaciones web modernas y funcionales. Con un año de experiencia desarrollando para mis clientes, me esfuerzo por ofrecer soluciones innovadoras que transformen sus ideas en realidad.
            </p>
            <p className="text-lg mb-4">
                Soy exalumno de la <span className="font-semibold text-blue-400">Universidad Tecnológica de Chile INACAP</span>, donde aprendí las bases sólidas para convertirme en el profesional que soy hoy. Siempre estoy aprendiendo y buscando nuevas tecnologías para estar a la vanguardia en el desarrollo web. 🧑‍💻
            </p>
            <p className="text-lg mb-4">
                En mi trabajo, pongo especial énfasis en la calidad, la eficiencia y la satisfacción del cliente. Creo en la comunicación abierta y en el poder de la tecnología para resolver problemas y mejorar vidas. 🌟
            </p>
            <p className="text-lg mb-6">
                Si estás buscando a alguien que pueda convertir tus ideas en aplicaciones increíbles, ¡no dudes en ponerte en contacto conmigo! 📩
            </p>

            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">📧 Contacto</h2>
                <p className="text-lg">
                    <span className="font-semibold text-blue-400">Correo:</span>{" "}
                    <a
                        href="mailto:javier.ordonez.barra@gmail.com"
                        className="text-blue-400 hover:underline"
                    >
                        javier.ordonez.barra@gmail.com
                    </a>
                </p>
            </div>

            <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold mb-2">💼 Servicios</h3>
                <ul className="list-disc list-inside text-left inline-block">
                    <li>Desarrollo de aplicaciones web a medida 🌐</li>
                    <li>Diseño de interfaces de usuario intuitivas 🎨</li>
                    <li>Integración de APIs y servicios externos 🔗</li>
                    <li>Optimización de rendimiento y SEO 🚀</li>
                </ul>
            </div>

            <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold mb-2">🌟 Tecnologías</h3>
                <p className="text-lg">
                    JavaScript, React, Node.js, TailwindCSS, y más.
                </p>
            </div>

            <p className="mt-8 text-center italic text-gray-400">
                "Transformar ideas en soluciones digitales, un código a la vez." 💻
            </p>
        </div>
        </>
    ) 
}

export default About


