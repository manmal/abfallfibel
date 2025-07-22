import pdfplumber
import json
import re

def clean_text(text):
    """Clean text by removing extra whitespace and newlines"""
    if not text:
        return ""
    # Replace multiple whitespaces with single space
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_waste_data_from_pdf(pdf_path):
    waste_data = {"waste_items": []}
    
    # Define column mappings based on the table structure
    # Columns 2-5: Household containers
    # Columns 6-9: Collection points (Sammelinsel)
    # Column 10: Recycling centers (WSZ)
    # Column 11: Paid collection (ASZ)
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            print(f"Processing page {page_num + 1}/{len(pdf.pages)}")
            
            tables = page.extract_tables()
            if not tables:
                continue
                
            table = tables[0]  # Each page has one table
            
            # Skip the header rows (usually first 3 rows contain headers)
            for row_idx in range(3, len(table)):
                row = table[row_idx]
                
                if not row or not row[0]:  # Skip empty rows
                    continue
                
                # Extract waste item name from first column
                item_name = clean_text(row[0])
                
                if not item_name or "Gewerbetreibende" in item_name:  # Skip non-item rows
                    continue
                
                # Check if second column has special waste indicator
                is_special_waste = bool(row[1] and 'X' in str(row[1]))
                
                # Initialize disposal locations
                disposal = {
                    "name": item_name,
                    "special_waste": is_special_waste,
                    "disposal_locations": {
                        "household": {
                            "gelber_sack": False,
                            "restmuell": False,
                            "bio": False,
                            "papier": False
                        },
                        "collection_points": {
                            "glas": False,
                            "textil": False,
                            "papier_karton_wsz": False,
                            "tkb": False
                        },
                        "recycling_centers": {
                            "wsz_breitenau": False,
                            "wsz_schloeglmuehl": False,
                            "wsz_grottendorf": False
                        },
                        "paid_collection": {
                            "asz_gruene_tonne": False
                        }
                    }
                }
                
                # Check each column for X marks
                # Household containers (columns 2-5)
                if len(row) > 2 and row[2] and 'X' in str(row[2]):
                    disposal["disposal_locations"]["household"]["gelber_sack"] = True
                if len(row) > 3 and row[3] and 'X' in str(row[3]):
                    disposal["disposal_locations"]["household"]["restmuell"] = True
                if len(row) > 4 and row[4] and 'X' in str(row[4]):
                    disposal["disposal_locations"]["household"]["bio"] = True
                if len(row) > 5 and row[5] and 'X' in str(row[5]):
                    disposal["disposal_locations"]["household"]["papier"] = True
                
                # Collection points (columns 6-9)
                if len(row) > 6 and row[6] and 'X' in str(row[6]):
                    disposal["disposal_locations"]["collection_points"]["glas"] = True
                if len(row) > 7 and row[7] and 'X' in str(row[7]):
                    disposal["disposal_locations"]["collection_points"]["textil"] = True
                if len(row) > 8 and row[8] and 'X' in str(row[8]):
                    disposal["disposal_locations"]["collection_points"]["papier_karton_wsz"] = True
                if len(row) > 9 and row[9] and 'X' in str(row[9]):
                    disposal["disposal_locations"]["collection_points"]["tkb"] = True
                
                # Recycling centers and paid collection (columns 10-11)
                if len(row) > 10 and row[10] and 'X' in str(row[10]):
                    # WSZ columns are merged, so any X means all three centers
                    disposal["disposal_locations"]["recycling_centers"]["wsz_breitenau"] = True
                    disposal["disposal_locations"]["recycling_centers"]["wsz_schloeglmuehl"] = True
                    disposal["disposal_locations"]["recycling_centers"]["wsz_grottendorf"] = True
                
                if len(row) > 11 and row[11] and 'X' in str(row[11]):
                    disposal["disposal_locations"]["paid_collection"]["asz_gruene_tonne"] = True
                
                # Only add items that have at least one disposal location
                has_disposal_location = any([
                    any(disposal["disposal_locations"]["household"].values()),
                    any(disposal["disposal_locations"]["collection_points"].values()),
                    any(disposal["disposal_locations"]["recycling_centers"].values()),
                    any(disposal["disposal_locations"]["paid_collection"].values())
                ])
                
                if has_disposal_location:
                    waste_data["waste_items"].append(disposal)
    
    return waste_data

def main():
    pdf_path = "Trennfibel_2025.pdf"
    output_path = "waste_disposal_data.json"
    
    print("Extracting waste disposal data from PDF...")
    waste_data = extract_waste_data_from_pdf(pdf_path)
    
    # Save to JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(waste_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nExtraction complete!")
    print(f"Total waste items extracted: {len(waste_data['waste_items'])}")
    print(f"Data saved to: {output_path}")
    
    # Print first few items as sample
    print("\nSample items:")
    for item in waste_data['waste_items'][:3]:
        print(f"\n- {item['name']}")
        print(f"  Special waste: {item['special_waste']}")
        for category, locations in item['disposal_locations'].items():
            active = [loc for loc, val in locations.items() if val]
            if active:
                print(f"  {category}: {', '.join(active)}")

if __name__ == "__main__":
    main()