import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Modal({isOpen, onClose, children} : ModalProps){
    if(!isOpen) return null; 
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black-200 bg-opacity-10 backdrop-blur-sm">
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-blue-400 text-white rounded-full p-2 cursor-pointer"
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal