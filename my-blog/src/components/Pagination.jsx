import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  
  // Generate page numbers array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      margin: '20px 0',
      padding: '20px'
    }}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 16px',
          border: '1px solid #ddd',
          backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          borderRadius: '4px'
        }}
      >
        Previous
      </button>

      {/* Page numbers */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === number ? '#007bff' : '#fff',
            color: currentPage === number ? '#fff' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
            minWidth: '40px'
          }}
        >
          {number}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 16px',
          border: '1px solid #ddd',
          backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          borderRadius: '4px'
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
