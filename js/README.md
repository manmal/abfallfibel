# Abfallfibel JavaScript Architecture

## Overview
The JavaScript codebase has been refactored to follow SOLID principles and DRY pattern with a modular ES6 architecture.

## Directory Structure
```
js/
├── config.js              # Configuration constants
├── models/               # Data models
│   ├── DisposalLabel.js
│   └── WasteItem.js
├── services/             # Business logic services
│   ├── DataService.js    # Data fetching and management
│   └── SearchService.js  # Search and filtering logic
├── utils/                # Utility classes
│   ├── ColorManager.js   # Color scheme management
│   └── TextUtils.js      # Text manipulation utilities
├── components/           # UI components
│   ├── Renderer.js       # Main rendering logic
│   ├── ModalManager.js   # Modal functionality
│   ├── AutocompleteManager.js # Autocomplete UI
│   └── LabelManager.js   # Label selection management
└── App.js                # Main application entry point
```

## Key Principles Applied

### SOLID Principles
- **Single Responsibility**: Each class has one clear responsibility
- **Open/Closed**: Classes are open for extension but closed for modification
- **Liskov Substitution**: Components can be replaced with their subtypes
- **Interface Segregation**: Interfaces are specific to client needs
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### DRY (Don't Repeat Yourself)
- Color management centralized in ColorManager
- Search logic reused across different contexts
- Rendering logic unified in Renderer component
- Configuration values stored in single location

## Module Responsibilities

### App.js
Main application controller that orchestrates all components.

### DataService
Handles data fetching and provides a clean API for data access.

### SearchService
Encapsulates all search and filtering algorithms.

### Renderer
Manages all DOM rendering operations for both mobile and desktop views.

### ModalManager
Handles modal dialog lifecycle and interactions.

### LabelManager
Manages selected disposal labels and their UI representation.

### AutocompleteManager
Handles autocomplete dropdown functionality.

### ColorManager
Centralizes color scheme logic for consistency.

### TextUtils
Provides text manipulation utilities like highlighting.