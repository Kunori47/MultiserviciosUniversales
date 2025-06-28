import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  actions?: (item: any) => React.ReactNode;
  keyField: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  data, 
  columns, 
  actions, 
  keyField 
}) => {
  return (
    <div className="responsive-table-container">
      <style jsx>{`
        .responsive-table-container table {
          width: 100%;
          border-collapse: collapse;
        }

        .responsive-table-container th,
        .responsive-table-container td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .responsive-table-container th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .responsive-table-container tr:hover {
          background-color: #f9fafb;
        }

        /* Pantallas grandes - tabla normal */
        @media (min-width: 1024px) {
          .responsive-table-container td[data-label]:before {
            display: none;
          }
        }

        /* Pantallas pequeñas - ocultar thead y mostrar labels */
        @media (max-width: 1023px) {
          .responsive-table-container thead {
            display: none;
          }

          .responsive-table-container tr {
            display: block;
            margin-bottom: 1rem;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .responsive-table-container td {
            display: block;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #f3f4f6;
            position: relative;
            padding-left: 40%;
          }

          .responsive-table-container td:last-child {
            border-bottom: none;
          }

          .responsive-table-container td[data-label]:before {
            content: attr(data-label) ": ";
            position: absolute;
            left: 1rem;
            width: 35%;
            font-weight: 600;
            color: #6b7280;
            white-space: nowrap;
          }

          .responsive-table-container .actions-column {
            padding-left: 1rem;
          }

          .responsive-table-container .actions-column:before {
            display: none;
          }
        }
      `}</style>

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
            {actions && <th className="text-center">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item[keyField]}>
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  data-label={column.label}
                  className={column.className}
                >
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              {actions && (
                <td className="actions-column before:hidden lg:w-1 whitespace-nowrap">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-gray-500 text-sm">
              Los datos aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;