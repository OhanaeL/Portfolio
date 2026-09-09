# About Folder

This folder contains the content for your **About Me** page at `/about`.

## How It Works

### Text Sections

Each `.txt` file in this folder becomes a separate section on your About page:

1. **Filename becomes the title**:
   - `introduction.txt` → "INTRODUCTION"
   - `my_background.txt` → "MY BACKGROUND"
   - `philosophy.txt` → "PHILOSOPHY"

2. **Formatting rules**:
   - Underscores (`_`) are replaced with spaces
   - Title is automatically converted to UPPERCASE
   - Files are displayed in alphabetical order

3. **Content**:
   - Write your content in plain text
   - Use blank lines to separate paragraphs
   - Simple and easy to edit!

### Skills Section

Create a `skills.csv` file to display your skills with visual progress bars.

**CSV Format:**
```csv
name,max,min,score,label,year
Python,100,0,85,Advanced,2023
JavaScript,100,0,75,Proficient,2023
```

**Columns:**
- `name`: Skill name (e.g., "Python", "JavaScript")
- `max`: Maximum score (usually 100)
- `min`: Minimum score (usually 0)
- `score`: Your current score (0-100)
- `label`: Proficiency level (e.g., "Beginner", "Advanced", "Expert")
- `year`: Year you started (optional - leave empty if not needed)

**The page automatically calculates percentages and displays animated progress bars!**

## Controlling Section Order

Create an `order.txt` file to control the order sections appear:

**order.txt:**
```
introduction
skills
philosophy
my_background
```

- List filenames (without .txt extension), one per line
- Use `skills` to position the skills chart wherever you want
- Sections appear in the order listed
- Any sections not in order.txt will appear after (alphabetically)
- If no order.txt exists, sections appear alphabetically with skills at the end

## Example Structure

```
about/
├── README.md
├── info.txt               ← Your name, age, etc.
├── order.txt              ← Controls section order
├── resume.pdf             ← Your resume (optional)
├── introduction.txt
├── my_background.txt
├── philosophy.txt
└── skills.csv             ← Skills chart (optional)
```

## Tips

- Add as many `.txt` files as you want - each becomes a section
- Use descriptive filenames (they become section titles)
- The skills.csv is optional - page works without it
- Use order.txt to arrange sections exactly how you want
- Keep section content focused and concise

## Example Content

**introduction.txt:**
```
Hi! I'm a passionate developer...

My journey started when...
```

**skills.csv:**
```csv
name,max,min,score,label,year
Python,100,0,90,Expert,2022
React,100,0,75,Proficient,2023
```

