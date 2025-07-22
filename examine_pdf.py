import pdfplumber
import json

pdf_path = "Trennfibel_2025.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    
    # Examine first few pages to understand structure
    for i in range(min(3, len(pdf.pages))):
        page = pdf.pages[i]
        print(f"\n--- Page {i+1} ---")
        
        # Extract text
        text = page.extract_text()
        if text:
            print("Text preview (first 500 chars):")
            print(text[:500])
        
        # Extract tables
        tables = page.extract_tables()
        print(f"\nNumber of tables found: {len(tables)}")
        
        if tables:
            for j, table in enumerate(tables):
                print(f"\nTable {j+1} dimensions: {len(table)} rows x {len(table[0]) if table else 0} columns")
                if table and len(table) > 0:
                    print("First 5 rows:")
                    for row_idx, row in enumerate(table[:5]):
                        print(f"Row {row_idx}: {row}")