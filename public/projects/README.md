# Projects Folder

This folder contains your portfolio projects that will be displayed on the home page and accessible via individual project pages.

## How to Add a Project

1. **Create a project folder**:
   - Navigate to the `projects` directory
   - Create a new folder with your project name (e.g., "My Awesome Project")

2. **Add metadata** (optional but recommended):
   - Create `metadata.txt` with project info
   - See format below

3. **Add description**:
   - Inside your project folder, create a `.txt` file (any name works)
   - Write your project description in plain text

## Project Metadata

Create `metadata.txt` in your project folder:

```txt
description: Short description for the project card
date: October 2025
team:
- Alice Johnson
- Bob Smith
- Charlie Davis
```

**Fields:**

- `description`: Short summary shown on home page project card
- `date`: When the project was created/completed
- `team`: List of team members (use `- Name` format, one per line)

**Usage:**

- Short description replaces "Click to view details" on cards
- Date appears with calendar icon
- Team shows as expandable list (hover to see all members)

1. **Add images**:
   - Create an `images` subfolder inside your project folder
   - Add your image files (PNG, JPG, GIF, WebP, SVG supported)

2. **Add image titles and descriptions** (optional):
   - Create `images/image_titles.txt`
   - Format: `filename.png: Title | Description`
   - Example:

     ```txt
     screenshot.png: Main Interface | Clean and modern design
     logo.png: Company Logo | Brand identity
     ```

## Project Order & Dropdown

Control which projects appear in the navbar dropdown and in what order:

**Create `order.txt` in the projects folder:**

```txt
My First Project
Web Design Portfolio
Mobile App Project
```

**Important:**

- Only projects listed in `order.txt` will appear in the dropdown menu
- Projects appear in the order you list them
- Projects not in `order.txt` are **hidden** from the dropdown
- If no `order.txt` exists, all projects appear alphabetically

## Project Navigation

When viewing a project, next/previous buttons allow you to navigate through projects in the order specified in `order.txt`. Navigation loops around (last project → first project).

## Linking Between Content

### In Project Descriptions

- **Hoverable images**: `[image:file.png:hover text]`
- **Link to other projects**: `[website_link:Project Name]`

### Example Project Structure

```txt
projects/
├── order.txt                    ← Controls dropdown and navigation order
├── My First Project/
│   ├── description.txt
│   └── images/
│       ├── image_titles.txt
│       ├── screenshot1.png
│       └── screenshot2.png
└── Another Project/
    ├── info.txt
    └── images/
        └── demo.jpg
```

## Tips

- Use descriptive folder names - they become your project titles
- Keep project names consistent with `order.txt`
- Update `order.txt` when you add/remove projects
- Images in the gallery appear at the top and are clickable
- Use the carousel for image browsing in the lightbox view
