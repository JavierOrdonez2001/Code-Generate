import BarNavegation from "../components/BarNavegation";


function About() {
    return (
        <>
            <BarNavegation></BarNavegation>
            
            <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto">

                


                <h1 className="text-3xl font-bold mb-4 text-center">Sobre TechStorePlus 🚀</h1>
                <p className="text-lg mb-4">
                    <span className="font-semibold text-blue-400">TechStorePlus</span> es una empresa dedicada a ofrecer soluciones digitales que simplifican la gestión de productos y procesos logísticos para comercios modernos. Nuestra misión es ayudar a negocios de todos los tamaños a optimizar su organización y trazabilidad de inventario.
                </p>
                <p className="text-lg mb-4">
                    Esta aplicación ha sido desarrollada específicamente para generar <span className="font-semibold text-blue-400">códigos QR</span> y <span className="font-semibold text-blue-400">códigos de barras</span> para productos, facilitando el etiquetado, escaneo y control eficiente de inventario.
                </p>
                <p className="text-lg mb-4">
                    Con una interfaz intuitiva y rápida, esta herramienta permite crear imágenes de códigos personalizables listas para imprimir o integrar en sistemas existentes. Es ideal para pequeñas y medianas empresas que buscan digitalizar sus operaciones sin complicaciones.
                </p>

                <div className="mt-8 text-center">
                    <h3 className="text-xl font-semibold mb-2">🔧 Funcionalidades principales</h3>
                    <ul className="list-disc list-inside text-left inline-block">
                        <li>Generación de códigos QR y de barras en tiempo real 🧾</li>
                        <li>Compatibilidad con múltiples formatos de productos 📦</li>
                        <li>Descarga de imágenes en alta resolución 💾</li>
                        <li>Interfaz simple, rápida y responsiva ⚡</li>
                    </ul>
                </div>

             

                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">📧 Contacto</h2>
                    <p className="text-lg">
                        <span className="font-semibold text-blue-400">Correo:</span>{" "}
                        <a
                            href="mailto:soporte@techstoreplus.com"
                            className="text-blue-400 hover:underline"
                        >
                            soporte@techstoreplus.com
                        </a>
                    </p>
                </div>

                <p className="mt-8 text-center italic text-gray-400">
                    "Innovación y eficiencia para tus productos, en un solo clic." 💼
                </p>
            </div>
        </>
    );
}

export default About;
