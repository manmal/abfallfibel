export class WasteItem {
    constructor(data) {
        this.name = data.name;
        this.specialWaste = data.special_waste || false;
        this.disposalLocations = {
            household: data.disposal_locations?.household || {},
            collectionPoints: data.disposal_locations?.collection_points || {},
            recyclingCenters: data.disposal_locations?.recycling_centers || {},
            paidCollection: data.disposal_locations?.paid_collection || {}
        };
    }

    getActiveDisposalOptions() {
        const options = [];
        
        // Household
        if (this.disposalLocations.household.gelber_sack) options.push('Gelber Sack');
        if (this.disposalLocations.household.restmuell) options.push('Restmüll');
        if (this.disposalLocations.household.bio) options.push('Bio');
        if (this.disposalLocations.household.papier) options.push('Papier');
        
        // Collection points
        if (this.disposalLocations.collectionPoints.glas) options.push('Glas-Container');
        if (this.disposalLocations.collectionPoints.textil) options.push('Textil-Container');
        if (this.disposalLocations.collectionPoints.papier_karton_wsz) options.push('Papier/Karton WSZ');
        if (this.disposalLocations.collectionPoints.tkb) options.push('TKB');
        
        // Recycling centers
        const wertstoffzentren = [];
        if (this.disposalLocations.recyclingCenters.wsz_breitenau) wertstoffzentren.push('Breitenau');
        if (this.disposalLocations.recyclingCenters.wsz_schloeglmuehl) wertstoffzentren.push('Schlöglmühl');
        if (this.disposalLocations.recyclingCenters.wsz_grottendorf) wertstoffzentren.push('Grottendorf');
        
        if (wertstoffzentren.length > 0) {
            options.push({
                type: 'wsz',
                label: `WSZ: ${wertstoffzentren.join(', ')}`,
                centers: wertstoffzentren
            });
        }
        
        return options;
    }

    hasPaidCollection() {
        return this.disposalLocations.paidCollection.asz_gruene_tonne || false;
    }

    matchesLabel(labelId) {
        const mappings = {
            'gelber_sack': () => this.disposalLocations.household.gelber_sack,
            'restmuell': () => this.disposalLocations.household.restmuell,
            'bio': () => this.disposalLocations.household.bio,
            'papier': () => this.disposalLocations.household.papier,
            'glas_container': () => this.disposalLocations.collectionPoints.glas,
            'textil_container': () => this.disposalLocations.collectionPoints.textil,
            'papier_karton_wsz': () => this.disposalLocations.collectionPoints.papier_karton_wsz,
            'tkb': () => this.disposalLocations.collectionPoints.tkb,
            'wsz_breitenau': () => this.disposalLocations.recyclingCenters.wsz_breitenau,
            'wsz_schloeglmuehl': () => this.disposalLocations.recyclingCenters.wsz_schloeglmuehl,
            'wsz_grottendorf': () => this.disposalLocations.recyclingCenters.wsz_grottendorf,
            'asz_gruene_tonne': () => this.disposalLocations.paidCollection.asz_gruene_tonne
        };

        return mappings[labelId] ? mappings[labelId]() : false;
    }
}