import openpyxl
import json
import os

def analyze_excel(file_path):
    wb = openpyxl.load_workbook(file_path, data_only=False) # Get formulas
    analysis = {
        "sheets": {}
    }
    
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        sheet_data = {
            "dimensions": f"{ws.min_row}:{ws.max_row}, {ws.min_column}:{ws.max_column}",
            "headers": [],
            "formulas": []
        }
        
        # Try to find headers (usually in the first few rows)
        for row in ws.iter_rows(min_row=1, max_row=5, values_only=True):
            if any(row):
                sheet_data["headers"].append([str(c) if c is not None else "" for c in row])
        
        # Look for formulas
        for row in ws.iter_rows():
            for cell in row:
                if cell.value and isinstance(cell.value, str) and cell.value.startswith('='):
                    # Only record unique or representative formulas to avoid bloat
                    sheet_data["formulas"].append({
                        "cell": cell.coordinate,
                        "formula": cell.value
                    })
        
        analysis["sheets"][sheet_name] = sheet_data
        
    return analysis

if __name__ == "__main__":
    file_path = r"c:\Users\syams\OneDrive\Desktop\bright-habits-main\365 Tracker - KrishBelief.xlsx"
    if os.path.exists(file_path):
        result = analyze_excel(file_path)
        # Limit formula output to first 50 to avoid huge JSON
        for sheet in result["sheets"].values():
            sheet["formulas"] = sheet["formulas"][:50]
        print(json.dumps(result, indent=2))
    else:
        print(f"File not found: {file_path}")
