import React, { useState } from 'react';
import ImportFile from './ImportFile';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("تم إغلاق المودال");
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <button
        onClick={openModal}
        className="bg-green-500 text-white py-2 px-4 rounded"
      >
        فتح مودال رفع الملف
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Import File Modal"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <ImportFile tableName="yourTableName" onClose={closeModal} />
        {/* زر إغلاق المودال (اختياري) */}
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        >
          إغلاق
        </button>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ParentComponent;
