import ExcelJs from 'exceljs';

export class ExcelUtils {
    static async readExcel(filePath: string, sheetName: string = 'Sheet1'): Promise<any[]> {
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(sheetName);

        if (!worksheet) {
            throw new Error(`Sheet ${sheetName} not found in ${filePath}`);
        }

        const data: any[] = [];
        const headers: string[] = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                // Header row
                row.eachCell((cell, colNumber) => {
                    headers[colNumber] = cell.value ? cell.value.toString() : '';
                });
            } else {
                // Data rows
                const rowData: any = {};
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber];
                    if (header) {
                        rowData[header] = cell.value;
                    }
                });
                data.push(rowData);
            }
        });

        return data;
    }
}
