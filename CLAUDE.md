# Development Guidelines for Abfallfibel

## Git Workflow

### Commit Strategy
Every change should be committed in logical chunks and pushed accordingly to GitHub Pages. Follow these principles:

1. **Logical Commits**: Group related changes together
   - Feature additions should be in separate commits
   - Bug fixes should be isolated
   - Style/UI changes should be grouped separately
   - Documentation updates in their own commits

2. **Commit Messages**: Use clear, descriptive commit messages
   - Use conventional commit format (feat:, fix:, docs:, style:, refactor:)
   - Include a brief description of what changed and why
   - Reference issues if applicable

3. **Push Regularly**: Push commits to GitHub after each logical chunk
   - Don't accumulate too many local commits
   - Push after completing each feature or fix
   - Ensure GitHub Pages deployment succeeds

### Example Workflow
```bash
# After implementing dark mode
git add index.html
git commit -m "feat: implement dark mode support"
git push

# After adding color-coded labels
git add index.html
git commit -m "feat: add color-coded waste disposal labels"
git push

# After updating documentation
git add README.md CLAUDE.md
git commit -m "docs: update development guidelines"
git push
```

## Project-Specific Guidelines

### Color Scheme
The following color scheme is used for waste disposal labels:
- **Gelber Sack** (Yellow Bag): Yellow
- **Restmüll** (Residual Waste): Dark Grey
- **Bio** (Organic): Brown
- **Papier** (Paper): Dark Wine Red
- **Wertstoffe** (Recyclables): Green
- **Kostenpflichtige** (Paid): Bright Red

### Dark Mode
- Implemented using Tailwind CSS with system preference detection
- All colors have dark mode variants for proper contrast
- Input fields must have visible text in both light and dark modes

### Testing Commands
Before committing, ensure the application works properly:
```bash
# Start local server for testing
python3 -m http.server 8000
# or
npx http-server
```

### Deployment
The project is deployed via GitHub Pages. After pushing to the main branch:
1. Changes are automatically deployed
2. Check the live site to ensure everything works
3. Test both light and dark modes
4. Verify all interactive features function correctly