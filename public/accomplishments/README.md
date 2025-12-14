# Accomplishments Folder

This folder contains your accomplishments that will be displayed on the **Accomplishments** page at `/timeline`.

## How to Add an Accomplishment

1. Create a new folder with the format: `YYYY - Accomplishment Name`
   - Example: `2025 - Won Hackathon`
   - Example: `2025 - Started Learning AI`
   - Example: `2024 - First Web Project`

2. Inside the folder, add:
   - A `.txt` file with your description (any name works)
   - An `images` subfolder (optional)
   - Add images to the `images` folder

3. In your text file:
   - Use `[image:filename.png]` to embed images inline
   - Use `[website_link:Project Name]` to link to a project page
   - Unused images will appear in a gallery below

## Multiple Accomplishments Per Year

**You can add as many accomplishments from the same year as you want!** Just create multiple folders with the same year:

```txt
accomplishments/
├── 2025 - Launched Portfolio Website/
├── 2025 - Started Learning AI/
├── 2025 - Won Coding Competition/
└── 2024 - Learned Web Development/
```

They will all appear on the timeline in reverse chronological order (2025 entries first, then 2024, etc.).

## Example Structure

```txt
accomplishments/
├── order.txt                           # Controls display order
├── 2025 - Launched Portfolio Website/
│   ├── description.txt
│   └── images/
│       ├── screenshot.png
│       └── logo.png
├── 2025 - Started Learning AI/
│   ├── description.txt
│   └── images/
└── 2024 - Learned Web Development/
    ├── info.txt
    └── images/
        └── certificate.jpg
```

## Order Control

**NEW:** You can now control the display order using `order.txt`:

1. Create an `order.txt` file in the `accomplishments/` folder
2. List accomplishment folder names in the order you want them to appear
3. Only accomplishments listed in `order.txt` will be displayed
4. If no `order.txt` exists, accomplishments are sorted by year (newest first)

Example `order.txt`:

```txt
2025 - Launched Portfolio Website
2025 - Started Learning AI
2024 - Learned Web Development
```

## Tips

- Use `order.txt` to control exactly which accomplishments appear and in what order
- If no `order.txt` exists, accomplishments are sorted by year (newest first)
- Multiple entries from the same year are sorted alphabetically within that year
- If no year is provided, the entry will still appear but without a year label
- Use descriptive folder names - they become the titles on the timeline!
- The year badge will appear for each entry (even if they're from the same year)
