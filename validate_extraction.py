import json

# Load the extracted data
with open('waste_disposal_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

waste_items = data['waste_items']

# Basic statistics
print(f"Total waste items: {len(waste_items)}")
print(f"\nSpecial waste items: {sum(1 for item in waste_items if item['special_waste'])}")
print(f"Regular waste items: {sum(1 for item in waste_items if not item['special_waste'])}")

# Count disposal locations
disposal_counts = {
    'gelber_sack': 0,
    'restmuell': 0,
    'bio': 0,
    'papier': 0,
    'glas': 0,
    'textil': 0,
    'papier_karton_wsz': 0,
    'tkb': 0,
    'wsz_centers': 0,
    'asz_gruene_tonne': 0
}

for item in waste_items:
    locations = item['disposal_locations']
    if locations['household']['gelber_sack']: disposal_counts['gelber_sack'] += 1
    if locations['household']['restmuell']: disposal_counts['restmuell'] += 1
    if locations['household']['bio']: disposal_counts['bio'] += 1
    if locations['household']['papier']: disposal_counts['papier'] += 1
    if locations['collection_points']['glas']: disposal_counts['glas'] += 1
    if locations['collection_points']['textil']: disposal_counts['textil'] += 1
    if locations['collection_points']['papier_karton_wsz']: disposal_counts['papier_karton_wsz'] += 1
    if locations['collection_points']['tkb']: disposal_counts['tkb'] += 1
    if locations['recycling_centers']['wsz_breitenau']: disposal_counts['wsz_centers'] += 1
    if locations['paid_collection']['asz_gruene_tonne']: disposal_counts['asz_gruene_tonne'] += 1

print("\nDisposal location usage:")
for location, count in disposal_counts.items():
    print(f"  {location}: {count} items")

# Find items with multiple disposal options
multi_disposal = []
for item in waste_items:
    disposal_options = 0
    for category in item['disposal_locations'].values():
        disposal_options += sum(1 for v in category.values() if v)
    if disposal_options > 1:
        multi_disposal.append((item['name'], disposal_options))

print(f"\nItems with multiple disposal options: {len(multi_disposal)}")
print("Examples:")
for name, count in multi_disposal[:5]:
    print(f"  {name}: {count} options")

# Sample items by category
print("\nSample items by disposal type:")
print("\nGelber Sack items:")
gelber_items = [item['name'] for item in waste_items if item['disposal_locations']['household']['gelber_sack']]
for item in gelber_items[:5]:
    print(f"  - {item}")

print("\nBio waste items:")
bio_items = [item['name'] for item in waste_items if item['disposal_locations']['household']['bio']]
for item in bio_items[:5]:
    print(f"  - {item}")