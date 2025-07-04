import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export interface ParsedFile {
  fileName: string;
  fileType: string;
  columns: string[];
  sampleData: any[];
  recordType: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileParserService {

  async parseFile(file: File, recordType: string): Promise<ParsedFile> {
    const fileType = this.getFileType(file.name);
    let columns: string[] = [];
    let sampleData: any[] = [];

    try {
      switch (fileType) {
        case 'csv':
          const csvResult = await this.parseCSV(file);
          columns = csvResult.columns;
          sampleData = csvResult.sampleData;
          break;
        case 'json':
          const jsonResult = await this.parseJSON(file);
          columns = jsonResult.columns;
          sampleData = jsonResult.sampleData;
          break;
        case 'excel':
          const excelResult = await this.parseExcel(file);
          columns = excelResult.columns;
          sampleData = excelResult.sampleData;
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      return {
        fileName: file.name,
        fileType,
        columns,
        sampleData,
        recordType
      };
    } catch (error) {
      console.error('Error parsing file:', error);
      throw error;
    }
  }

  private getFileType(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'csv':
        return 'csv';
      case 'json':
        return 'json';
      case 'xlsx':
      case 'xls':
        return 'excel';
      default:
        throw new Error(`Unsupported file extension: ${extension}`);
    }
  }

  private async parseCSV(file: File): Promise<{ columns: string[], sampleData: any[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('Empty CSV file'));
            return;
          }

          // Parse header
          const header = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
          const columns = header.filter(col => col.length > 0);

          // Parse sample data (first 5 rows)
          const sampleData = lines.slice(1, 6).map(line => {
            const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
            const row: any = {};
            columns.forEach((col, index) => {
              row[col] = values[index] || '';
            });
            return row;
          });

          resolve({ columns, sampleData });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read CSV file'));
      reader.readAsText(file);
    });
  }

  private async parseJSON(file: File): Promise<{ columns: string[], sampleData: any[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = JSON.parse(text);
          
          let items: any[];
          if (Array.isArray(data)) {
            items = data;
          } else if (data.items && Array.isArray(data.items)) {
            items = data.items;
          } else {
            items = [data];
          }

          if (items.length === 0) {
            reject(new Error('Empty JSON file'));
            return;
          }

          // Extract columns from first item
          const columns = Object.keys(items[0]);
          const sampleData = items.slice(0, 5);

          resolve({ columns, sampleData });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read JSON file'));
      reader.readAsText(file);
    });
  }

  private async parseExcel(file: File): Promise<{ columns: string[], sampleData: any[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (!json.length) {
            reject(new Error('Empty Excel sheet'));
            return;
          }
          const header = json[0] as string[];
          const columns = header.map(col => String(col).trim()).filter(col => col.length > 0);
          const sampleData = json.slice(1, 6).map(rowArr => {
            const row: any = {};
            const arr = rowArr as any[];
            columns.forEach((col, idx) => {
              row[col] = arr[idx] || '';
            });
            return row;
          });
          resolve({ columns, sampleData });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }
} 