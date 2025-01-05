import React, { useEffect, useState } from 'react';

const QRCode = () => {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    const fetchSVG = async () => {
      try {
           
        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="200" height="200" viewBox="0 0 200 200">
          <rect x="0" y="0" width="200" height="200" fill="#ffffff"/>
          <g transform="scale(9.524)">
            <g transform="translate(0,0)">
              <path fill-rule="evenodd" d="M8 0L8 1L9 1L9 0ZM10 0L10 2L8 2L8 5L9 5L9 6L8 6L8 7L9 7L9 6L10 6L10 7L11 7L11 8L8 8L8 9L10 9L10 10L9 10L9 11L7 11L7 10L6 10L6 9L7 9L7 8L6 8L6 9L5 9L5 10L3 10L3 9L4 9L4 8L0 8L0 9L2 9L2 11L5 11L5 10L6 10L6 11L7 11L7 12L5 12L5 13L8 13L8 14L11 14L11 15L14 15L14 14L15 14L15 16L14 16L14 19L13 19L13 18L12 18L12 17L13 17L13 16L12 16L12 17L11 17L11 16L10 16L10 17L8 17L8 21L9 21L9 19L10 19L10 21L11 21L11 19L10 19L10 17L11 17L11 18L12 18L12 19L13 19L13 21L14 21L14 19L15 19L15 20L19 20L19 21L20 21L20 20L21 20L21 19L19 19L19 18L20 18L20 17L21 17L21 16L17 16L17 14L15 14L15 13L14 13L14 14L12 14L12 13L13 13L13 12L14 12L14 11L15 11L15 12L18 12L18 11L19 11L19 13L18 13L18 14L20 14L20 15L21 15L21 8L20 8L20 11L19 11L19 10L17 10L17 9L19 9L19 8L16 8L16 9L15 9L15 10L13 10L13 9L14 9L14 8L13 8L13 5L12 5L12 4L13 4L13 3L12 3L12 1L13 1L13 0ZM10 2L10 4L9 4L9 5L11 5L11 4L12 4L12 3L11 3L11 2ZM11 6L11 7L12 7L12 6ZM0 10L0 13L1 13L1 10ZM12 10L12 12L11 12L11 11L10 11L10 12L11 12L11 13L12 13L12 12L13 12L13 10ZM15 10L15 11L17 11L17 10ZM2 12L2 13L4 13L4 12ZM8 12L8 13L9 13L9 12ZM15 17L15 19L17 19L17 18L16 18L16 17ZM0 0L0 7L7 7L7 0ZM1 1L1 6L6 6L6 1ZM2 2L2 5L5 5L5 2ZM14 0L14 7L21 7L21 0ZM15 1L15 6L20 6L20 1ZM16 2L16 5L19 5L19 2ZM0 14L0 21L7 21L7 14ZM1 15L1 20L6 20L6 15ZM2 16L2 19L5 19L5 16Z" fill="#000000"/>
            </g>
          </g>
        </svg>`;

        // ترميز الـ SVG
        const encoded = encodeURIComponent(svgString);
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;
        setDataUrl(dataUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSVG();
  }, []);

  return (
    <div>
      {dataUrl ? (
        <img src={dataUrl} alt="QR Code" width="200" height="200" />
      ) : (
        <p>جاري تحميل QR Code...</p>
      )}
    </div>
  );
};

export default QRCode;
