import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import type { FordUser } from './types';

export const generateId = () => uuidv4();

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500/20 text-green-400';
    case 'hold':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'inactive':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

export const parseExcelData = (file: File): Promise<FordUser[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const users: FordUser[] = jsonData.map((row: any) => {
          let expirationDate: Date;
          try {
            const dateValue = row['Fecha Expiración'] || row['Expiration Date'] || row.expirationDate;
            if (typeof dateValue === 'string') {
              // Try different date formats
              const formats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'];
              for (const dateFormat of formats) {
                try {
                  expirationDate = parse(dateValue, dateFormat, new Date());
                  if (isValidDate(expirationDate)) break;
                } catch (e) {
                  continue;
                }
              }
              if (!isValidDate(expirationDate)) {
                throw new Error('Invalid date format');
              }
            } else if (dateValue instanceof Date) {
              expirationDate = dateValue;
            } else {
              expirationDate = new Date();
              expirationDate.setMonth(expirationDate.getMonth() + 6);
            }
          } catch (error) {
            console.warn('Error parsing date, using default:', error);
            expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 6);
          }

          // Intentar obtener el nombre completo de diferentes campos posibles
          const fullName = row['Nombre Completo'] || row['Full Name'] || row.name || '';
          const [firstName = '', lastName = ''] = fullName.split(' ');

          return {
            id: generateId(),
            name: fullName || `${firstName} ${lastName}`.trim(),
            cdsid: row.CDSID || row.cdsid || '',
            expirationDate,
            status: row.Status || row.status || row.Estado || 'Active',
            employeeType: row['Tipo Empleado'] || row.Type || row.employeeType || '',
            company: row.Empresa || row.Company || row.company || '',
            lastModified: new Date().toISOString(),
            modifiedBy: 'System'
          };
        });

        resolve(users);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const formatExpirationDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};